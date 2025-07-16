import { pgTable, uuid, date, integer, varchar, timestamp, decimal } from "drizzle-orm/pg-core";

export const weatherTable = pgTable("weather", {
  id: uuid().primaryKey().defaultRandom(),
  date: date().notNull(),
  temperature_min: integer().notNull(),
  temperature_max: integer().notNull(),
  condition: varchar({ length: 50 }).notNull(),
  description: varchar({ length: 255 }),
  humidity: integer(),
  wind_speed: decimal({ precision: 5, scale: 2 }),
  fetched_at: timestamp("fetched_at").notNull().defaultNow(),
  expires_at: timestamp("expires_at").notNull(),
});

export type Weather = typeof weatherTable.$inferSelect;
export type WeatherInsert = typeof weatherTable.$inferInsert; 