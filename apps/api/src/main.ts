// Sentry must be initialized before anything else loads.
import "./instrument";
import "reflect-metadata";

import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { TrafficMetricsService } from "./metrics/traffic-metrics.service";
import { trafficMiddleware } from "./metrics/traffic.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Record request metrics (status/latency/route) into the rolling window.
  app.use(trafficMiddleware(app.get(TrafficMetricsService)));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // The consoles (app./harmony.) call this API cross-subdomain with the shared
  // session cookie, so credentialed CORS must be allow-listed by origin.
  const origins = (process.env.CORS_ORIGINS ?? "http://localhost:3001,http://localhost:3002")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({ origin: origins, credentials: true });

  // Flush Sentry + close the DB pool cleanly on SIGTERM/SIGINT.
  app.enableShutdownHooks();

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, process.env.HOSTNAME ?? "0.0.0.0");
}

void bootstrap();
