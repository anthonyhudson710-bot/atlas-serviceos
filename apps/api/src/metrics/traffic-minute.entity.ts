import { Column, Entity, PrimaryColumn } from "typeorm";

/**
 * One persisted row per UTC minute of API traffic. Aggregates (not raw requests)
 * so the table stays tiny — at most ~one row/minute, pruned to a retention
 * horizon. Survives API redeploys/restarts (it lives in Postgres), which is the
 * whole point of the persistent (Tier-2) metrics.
 *
 * Latency is stored as a fixed-bucket histogram so window percentiles can be
 * computed correctly by summing histograms across minutes (averaging per-minute
 * percentiles would be statistically wrong).
 */
@Entity({ name: "traffic_minutes" })
export class TrafficMinute {
  @PrimaryColumn({ type: "timestamptz" })
  minute!: Date;

  @Column({ type: "int", default: 0 })
  total!: number;

  @Column({ name: "c2xx", type: "int", default: 0 })
  c2xx!: number;

  @Column({ name: "c3xx", type: "int", default: 0 })
  c3xx!: number;

  @Column({ name: "c4xx", type: "int", default: 0 })
  c4xx!: number;

  @Column({ name: "c5xx", type: "int", default: 0 })
  c5xx!: number;

  // status code -> count, e.g. { "200": 74, "404": 2 }
  @Column({ type: "jsonb", nullable: true })
  codes!: Record<string, number> | null;

  // fixed-bucket latency histogram (counts per bucket; see LAT_BOUNDS)
  @Column({ name: "lat_hist", type: "jsonb", nullable: true })
  latHist!: number[] | null;

  // route -> { count, errors(5xx) }
  @Column({ type: "jsonb", nullable: true })
  routes!: Record<string, { count: number; errors: number }> | null;

  // requests classified as automated (bot/scanner/monitor) this minute
  @Column({ type: "int", default: 0 })
  bots!: number;

  // client IP -> { count, errors(5xx), ua, bot } — capped per minute; overflow → "other"
  @Column({ type: "jsonb", nullable: true })
  clients!: Record<string, { count: number; errors: number; ua: string; bot: boolean }> | null;
}
