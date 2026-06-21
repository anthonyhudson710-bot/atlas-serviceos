import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { CredentialsDto } from "./dto/credentials.dto";
import { SESSION_COOKIE, sessionCookieOptions } from "./cookie";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly jwt: JwtService,
  ) {}

  @Post("register")
  async register(
    @Body() dto: CredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Public self-registration is disabled — accounts are created by admins via
    // the invite flow. ALLOW_OPEN_REGISTRATION=true is a temporary bootstrap escape
    // hatch only (e.g. to create the very first admin).
    if (process.env.ALLOW_OPEN_REGISTRATION !== "true") {
      throw new ForbiddenException("Public registration is disabled");
    }
    const { token, user } = await this.auth.register(dto.email, dto.password);
    res.cookie(SESSION_COOKIE, token, sessionCookieOptions());
    return { user };
  }

  @Post("login")
  async login(
    @Body() dto: CredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.auth.login(dto.email, dto.password);
    res.cookie(SESSION_COOKIE, token, sessionCookieOptions());
    return { user };
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(SESSION_COOKIE, sessionCookieOptions());
    return { ok: true };
  }

  @Get("me")
  async me(@Req() req: Request) {
    const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = this.jwt.verify<{ sub: string }>(token);
      return await this.auth.me(payload.sub);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
