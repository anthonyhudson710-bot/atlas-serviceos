import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SentryModule, SentryGlobalFilter } from "@sentry/nestjs/setup";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { User } from "./auth/user.entity";

@Module({
  imports: [
    // Registers the Sentry tracing interceptor globally.
    SentryModule.forRoot(),

    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST ?? "localhost",
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.POSTGRES_USER ?? "atlas",
      password: process.env.POSTGRES_PASSWORD ?? "atlas",
      database: process.env.POSTGRES_DB ?? "atlas",
      entities: [User],
      // Auto-creates the schema from entities. Fine for this scaffold; switch to
      // committed migrations before there's data you can't afford to lose.
      synchronize: process.env.DB_SYNCHRONIZE !== "false",
      // Don't crash the whole process the instant Postgres is briefly unready.
      retryAttempts: 10,
      retryDelay: 3000,
    }),

    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    // Captures unhandled exceptions across HTTP/RPC contexts and reports them.
    { provide: APP_FILTER, useClass: SentryGlobalFilter },
  ],
})
export class AppModule {}
