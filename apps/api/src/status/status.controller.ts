import { Controller, Get, Req, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { SESSION_COOKIE } from "../auth/cookie";
import { StatusService } from "./status.service";

@Controller("status")
export class StatusController {
  constructor(
    private readonly status: StatusService,
    private readonly jwt: JwtService,
  ) {}

  // Platform health for the Harmony dashboard. Requires a valid session (the
  // consoles are already login-gated; this keeps infra health from leaking).
  @Get()
  async getStatus(@Req() req: Request) {
    const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      this.jwt.verify(token);
    } catch {
      throw new UnauthorizedException();
    }
    return this.status.getStatus();
  }
}
