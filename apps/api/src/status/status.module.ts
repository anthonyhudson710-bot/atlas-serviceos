import { Module } from "@nestjs/common";
import { StatusController } from "./status.controller";
import { StatusService } from "./status.service";

// DataSource (TypeOrmModule.forRoot) and JwtService (global JwtModule) are
// available app-wide, so this module just wires its own controller + service.
@Module({
  controllers: [StatusController],
  providers: [StatusService],
})
export class StatusModule {}
