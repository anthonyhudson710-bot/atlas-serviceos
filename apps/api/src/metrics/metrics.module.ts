import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MetricsController } from "./metrics.controller";
import { TrafficMetricsService } from "./traffic-metrics.service";
import { TrafficMinute } from "./traffic-minute.entity";

// TrafficMetricsService is a singleton shared by the controller and the
// request-recording middleware (resolved via app.get() in main.ts).
@Module({
  imports: [TypeOrmModule.forFeature([TrafficMinute])],
  controllers: [MetricsController],
  providers: [TrafficMetricsService],
  exports: [TrafficMetricsService],
})
export class MetricsModule {}
