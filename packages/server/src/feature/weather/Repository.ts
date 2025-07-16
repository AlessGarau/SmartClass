import { Service } from "typedi";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { and, eq, gte, lt } from "drizzle-orm";
import { database } from "../../../database/database";
import {
  Weather,
  WeatherInsert,
  weatherTable,
} from "../../../database/schema/weather";
import { IWeatherRepository } from "./interface/IRepository";

@Service()
export class WeatherRepository implements IWeatherRepository {
  private db: NodePgDatabase<Record<string, never>>;

  constructor() {
    this.db = database;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Weather[]> {
    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    return this.db
      .select()
      .from(weatherTable)
      .where(
        and(
          gte(weatherTable.date, startDateStr),
          lt(weatherTable.date, endDateStr),
          gte(weatherTable.expires_at, new Date()),
        ),
      );
  }

  async findByDate(date: Date): Promise<Weather | null> {
    const dateStr = date.toISOString().split("T")[0];

    const result = await this.db
      .select()
      .from(weatherTable)
      .where(
        and(
          eq(weatherTable.date, dateStr),
          gte(weatherTable.expires_at, new Date()),
        ),
      )
      .limit(1);

    return result[0] || null;
  }

  async create(weatherData: WeatherInsert): Promise<Weather> {
    const result = await this.db
      .insert(weatherTable)
      .values(weatherData)
      .returning();

    return result[0];
  }

  async deleteExpired(): Promise<void> {
    await this.db
      .delete(weatherTable)
      .where(lt(weatherTable.expires_at, new Date()));
  }
}
