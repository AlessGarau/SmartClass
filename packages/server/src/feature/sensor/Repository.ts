import { Service } from "typedi";
import { and, eq, gte, lt, asc } from "drizzle-orm";

import { ISensorRepository } from "./interface/IRepository";
import { DailySensorData, SensorDataPoint } from "./validate";
import { database } from "../../../database/database";
import {
  temperatureTable,
  humidityTable,
  pressureTable,
  movementTable,
} from "../../../database/schema";

@Service()
export class SensorRepository implements ISensorRepository {
  async getDailySensorData(
    roomId: string,
    date: string,
  ): Promise<DailySensorData[]> {
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    const results: DailySensorData[] = [];

    const temperatureData = await database
      .select({
        data: temperatureTable.data,
        saved_at: temperatureTable.saved_at,
      })
      .from(temperatureTable)
      .where(
        and(
          eq(temperatureTable.room_id, roomId),
          gte(temperatureTable.saved_at, startDate),
          lt(temperatureTable.saved_at, endDate),
        ),
      )
      .orderBy(asc(temperatureTable.saved_at));

    if (temperatureData.length > 0) {
      const data: SensorDataPoint[] = temperatureData
        .map((item) => {
          const value = parseFloat(item.data);
          return {
            timestamp: item.saved_at.toISOString(),
            value: isNaN(value) ? 0 : value,
          };
        })
        .filter((item) => !isNaN(item.value) || item.value === 0);

      results.push({
        roomId,
        date,
        sensorType: "temperature",
        unit: "°C",
        data,
      });
    }

    const humidityData = await database
      .select({
        data: humidityTable.data,
        saved_at: humidityTable.saved_at,
      })
      .from(humidityTable)
      .where(
        and(
          eq(humidityTable.room_id, roomId),
          gte(humidityTable.saved_at, startDate),
          lt(humidityTable.saved_at, endDate),
        ),
      )
      .orderBy(asc(humidityTable.saved_at));

    if (humidityData.length > 0) {
      const data: SensorDataPoint[] = humidityData
        .map((item) => {
          const value = parseFloat(item.data);
          return {
            timestamp: item.saved_at.toISOString(),
            value: isNaN(value) ? 0 : value,
          };
        })
        .filter((item) => !isNaN(item.value) || item.value === 0);

      results.push({
        roomId,
        date,
        sensorType: "humidity",
        unit: "%",
        data,
      });
    }

    const pressureData = await database
      .select({
        data: pressureTable.data,
        saved_at: pressureTable.saved_at,
      })
      .from(pressureTable)
      .where(
        and(
          eq(pressureTable.room_id, roomId),
          gte(pressureTable.saved_at, startDate),
          lt(pressureTable.saved_at, endDate),
        ),
      )
      .orderBy(asc(pressureTable.saved_at));

    if (pressureData.length > 0) {
      const data: SensorDataPoint[] = pressureData
        .map((item) => {
          const value = parseFloat(item.data);
          return {
            timestamp: item.saved_at.toISOString(),
            value: isNaN(value) ? 0 : value,
          };
        })
        .filter((item) => !isNaN(item.value) || item.value === 0);

      results.push({
        roomId,
        date,
        sensorType: "pressure",
        unit: "hPa",
        data,
      });
    }

    const movementData = await database
      .select({
        data: movementTable.data,
        saved_at: movementTable.saved_at,
      })
      .from(movementTable)
      .where(
        and(
          eq(movementTable.room_id, roomId),
          gte(movementTable.saved_at, startDate),
          lt(movementTable.saved_at, endDate),
        ),
      )
      .orderBy(asc(movementTable.saved_at));

    if (movementData.length > 0) {
      const data: SensorDataPoint[] = movementData.map((item) => {
        let value: number;
        const dataStr = item.data.toLowerCase();
        if (
          dataStr.includes("detected") ||
                    dataStr === "true" ||
                    dataStr === "1"
        ) {
          value = 1;
        } else if (
          dataStr.includes("no_movement") ||
                    dataStr === "false" ||
                    dataStr === "0"
        ) {
          value = 0;
        } else {
          const numValue = parseFloat(item.data);
          value = isNaN(numValue) ? 0 : numValue;
        }

        return {
          timestamp: item.saved_at.toISOString(),
          value,
        };
      });

      results.push({
        roomId,
        date,
        sensorType: "movement",
        unit: "boolean",
        data,
      });
    }

    return results;
  }
}
