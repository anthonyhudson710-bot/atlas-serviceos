import { Module } from "@nestjs/common";
import { MetricsController } from "./metrics.controller";
import { TrafficMetricsService } from "./traffic-metrics.service";

// TrafficMetricsService is a singleton shared by the controller and the
// request-recording middleware (resolved via app.get() in main.ts).
@Module({
  controllers: [MetricsController],
  providers: [TrafficMetricsService],
  exports: [TrafficMetricsService],
})
export class MetricsModule {}
