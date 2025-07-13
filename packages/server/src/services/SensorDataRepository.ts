import { Service } from "typedi";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { database } from "../../database/database";
import { temperatureTable } from "../../database/schema/temperature";
import { humidityTable } from "../../database/schema/humidity";
import { pressureTable } from "../../database/schema/pressure";
import { movementTable } from "../../database/schema/movement";

export interface SensorData {
  room_id: string;
  sensor_id: string;
  data: string;
  saved_at?: Date;
}

@Service()
export class SensorDataRepository {
  private db: NodePgDatabase<Record<string, never>>;
  private idCounter = 0;

  constructor() {
    this.db = database;
  }

  async insertTemperature(sensorData: SensorData): Promise<void> {
    await this.db.insert(temperatureTable).values({
      room_id: sensorData.room_id,
      sensor_id: sensorData.sensor_id,
      data: sensorData.data,
      saved_at: sensorData.saved_at || new Date(),
    });
  }

  async insertHumidity(sensorData: SensorData): Promise<void> {
    await this.db.insert(humidityTable).values({
      room_id: sensorData.room_id,
      sensor_id: sensorData.sensor_id,
      data: sensorData.data,
      saved_at: sensorData.saved_at || new Date(),
    });
  }

  async insertPressure(sensorData: SensorData): Promise<void> {
    const id = Date.now() * 1000 + (this.idCounter++ % 1000); // TOOD : changer la table pour un uuid
    await this.db.insert(pressureTable).values({
      id: id,
      room_id: sensorData.room_id,
      sensor_id: sensorData.sensor_id,
      data: sensorData.data,
      saved_at: sensorData.saved_at || new Date(),
    });
  }

  async insertMovement(sensorData: SensorData): Promise<void> {
    const id = Date.now() * 1000 + (this.idCounter++ % 1000);
    await this.db.insert(movementTable).values({
      id: id,
      room_id: sensorData.room_id,
      sensor_id: sensorData.sensor_id,
      data: sensorData.data,
      saved_at: sensorData.saved_at || new Date(),
    });
  }
} 