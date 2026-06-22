import { Controller, Get, Query, Req, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { SESSION_COOKIE } from "../auth/cookie";
import { TrafficMetricsService } from "./traffic-metrics.service";

@Controller("metrics")
export class MetricsController {
  constructor(
    private readonly traffic: TrafficMetricsService,
    private readonly jwt: JwtService,
  ) {}

  // Rolling-window API traffic for the dashboard. Session-guarded like /status.
  @Get("traffic")
  getTraffic(@Req() req: Request, @Query("window") window?: string) {
    const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      this.jwt.verify(token);
    } catch {
      throw new UnauthorizedException();
    }
    const minutes = window === "15m" ? 15 : 60;
    return this.traffic.snapshot(minutes);
  }
}
