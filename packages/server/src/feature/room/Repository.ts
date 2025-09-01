import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Service } from "typedi";
import { database } from "../../../database/database";
import {
  humidityTable,
  movementTable,
  pressureTable,
  temperatureTable,
} from "../../../database/schema";
import { roomTable } from "../../../database/schema/room";
import { PostgresErrorCode } from "../../middleware/error/PostgresErrorCode";
import { RoomError } from "../../middleware/error/roomError";
import { IRoomRepository } from "./interface/IRepository";
import {
  CreateRoomParams,
  GetRoomsQueryParams,
  PatchRoomParams,
  PutRoomParams,
  Room,
  RoomFilter,
  RoomWithMetrics,
  dbRoom,
  dbRowWithMetrics,
} from "./validate";

@Service()
export class RoomRepository implements IRoomRepository {
  private _db: NodePgDatabase<Record<string, never>>;
  constructor() {
    this._db = database;
  }

  private transformRoom(room: dbRoom): Room {
    return {
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      building: room.building,
      floor: room.floor,
      isEnabled: room.is_enabled,
    };
  }
  private transformRoomWithMetrics = (
    row: dbRowWithMetrics,
  ): RoomWithMetrics => ({
    ...this.transformRoom(row),
    temperature: row.temperature ? parseFloat(row.temperature) : 0,
    humidity: row.humidity ? parseFloat(row.humidity) : 0,
    pressure: row.pressure ? parseFloat(row.pressure) : 0,
    movement: row.movement || "no_movement",
  });

  private latestSources() {
    const latestTemperature = this._db
      .selectDistinctOn([temperatureTable.room_id], {
        room_id: temperatureTable.room_id,
        data: temperatureTable.data,
        saved_at: temperatureTable.saved_at,
      })
      .from(temperatureTable)
      .orderBy(temperatureTable.room_id, desc(temperatureTable.saved_at))
      .as("latest_temperature");

    const latestHumidity = this._db
      .selectDistinctOn([humidityTable.room_id], {
        room_id: humidityTable.room_id,
        data: humidityTable.data,
        saved_at: humidityTable.saved_at,
      })
      .from(humidityTable)
      .orderBy(humidityTable.room_id, desc(humidityTable.saved_at))
      .as("latest_humidity");

    const latestPressure = this._db
      .selectDistinctOn([pressureTable.room_id], {
        room_id: pressureTable.room_id,
        data: pressureTable.data,
        saved_at: pressureTable.saved_at,
      })
      .from(pressureTable)
      .orderBy(pressureTable.room_id, desc(pressureTable.saved_at))
      .as("latest_pressure");

    const latestMovement = this._db
      .selectDistinctOn([movementTable.room_id], {
        room_id: movementTable.room_id,
        data: movementTable.data,
        saved_at: movementTable.saved_at,
      })
      .from(movementTable)
      .orderBy(movementTable.room_id, desc(movementTable.saved_at))
      .as("latest_movement");

    return {
      latestTemperature,
      latestHumidity,
      latestPressure,
      latestMovement,
    } as const;
  }

  private selectedFieldsFrom(src: {
        latestTemperature: any;
        latestHumidity: any;
        latestPressure: any;
        latestMovement: any;
    }) {
    const {
      latestTemperature,
      latestHumidity,
      latestPressure,
      latestMovement,
    } = src;
    return {
      id: roomTable.id,
      name: roomTable.name,
      capacity: roomTable.capacity,
      building: roomTable.building,
      floor: roomTable.floor,
      is_enabled: roomTable.is_enabled,
      temperature: latestTemperature.data,
      humidity: latestHumidity.data,
      pressure: latestPressure.data,
      movement: latestMovement.data,
    } as const;
  }

  private joinLatest(q: any, src: any) {
    const {
      latestTemperature,
      latestHumidity,
      latestPressure,
      latestMovement,
    } = src;
    return q
      .leftJoin(
        latestTemperature,
        eq(latestTemperature.room_id, roomTable.id),
      )
      .leftJoin(latestHumidity, eq(latestHumidity.room_id, roomTable.id))
      .leftJoin(latestPressure, eq(latestPressure.room_id, roomTable.id))
      .leftJoin(latestMovement, eq(latestMovement.room_id, roomTable.id));
  }

  async getRooms(params: GetRoomsQueryParams): Promise<RoomWithMetrics[]> {
    const src = this.latestSources();
    const query = this._db
      .select(this.selectedFieldsFrom(src))
      .from(roomTable);

    this.joinLatest(query, src);

    this.applyFilter(
      {
        search: params.search,
        isEnabled: params.isEnabled,
        building: params.building,
        floor: params.floor,
      },
      query,
    );

    if (params.limit !== undefined) {
      query.limit(params.limit);
    }
    if (params.offset !== undefined) {
      query.offset(params.offset);
    }

    const rows = await query;
    return rows.map((r) => this.transformRoomWithMetrics(r));
  }

  async getRoom(id: string): Promise<RoomWithMetrics | null> {
    const src = this.latestSources();
    const query = this._db
      .select(this.selectedFieldsFrom(src))
      .from(roomTable)
      .where(eq(roomTable.id, id))
      .limit(1);

    this.joinLatest(query, src);

    const rows = await query;
    return rows[0] ? this.transformRoomWithMetrics(rows[0]) : null;
  }

  private applyFilter(filter: RoomFilter, query: any): void {
    if (!filter) {
      return;
    }

    const conditions = [];

    if (filter.search) {
      conditions.push(ilike(roomTable.name, `%${filter.search}%`));
    }

    if (filter.building) {
      conditions.push(ilike(roomTable.building, `%${filter.building}%`));
    }

    if (filter.floor !== undefined) {
      conditions.push(eq(roomTable.floor, filter.floor));
    }

    if (filter.isEnabled !== undefined) {
      conditions.push(eq(roomTable.is_enabled, filter.isEnabled));
    }

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }
  }

  async create(RoomCreateParams: CreateRoomParams): Promise<Room> {
    try {
      const result = await this._db
        .insert(roomTable)
        .values({
          name: RoomCreateParams.name,
          capacity: RoomCreateParams.capacity,
          building: RoomCreateParams.building,
          floor: RoomCreateParams.floor,
          is_enabled: RoomCreateParams.isEnabled,
        })
        .returning();
      return this.transformRoom(result[0]);
    } catch (error: any) {
      if (error.cause.code === PostgresErrorCode.UNIQUE_VIOLATION) {
        throw RoomError.alreadyExists(
          `Room name "${RoomCreateParams.name}" already exists.`,
        );
      }
      throw RoomError.creationFailed(
        "Unexpected error during room creation",
        error,
      );
    }
  }

  async getRoomsCount(filter: RoomFilter): Promise<number> {
    const query = this._db
      .select({ count: sql<number>`count(*)` })
      .from(roomTable);

    this.applyFilter(filter, query);

    const result = await query;
    return Number(result[0].count);
  }

  async putRoom(id: string, roomUpdateParams: PutRoomParams): Promise<Room> {
    try {
      const updatedRoom = await this._db
        .update(roomTable)
        .set({
          name: roomUpdateParams.name,
          capacity: roomUpdateParams.capacity,
          building: roomUpdateParams.building,
          floor: roomUpdateParams.floor,
          is_enabled: roomUpdateParams.isEnabled,
        })
        .where(eq(roomTable.id, id))
        .returning();

      if (updatedRoom.length === 0) {
        throw RoomError.updateFailed(
          `Failed to update room with ID "${id}".`,
        );
      }
      return this.transformRoom(updatedRoom[0]);
    } catch (error: any) {
      if (error.cause.code === PostgresErrorCode.UNIQUE_VIOLATION) {
        throw RoomError.alreadyExists(
          `Room name "${roomUpdateParams.name}" already exists.`,
        );
      }
      throw RoomError.updateFailed(
        "Unexpected error during room update",
        error,
      );
    }
  }

  async patchRoom(
    id: string,
    roomUpdateParams: PatchRoomParams,
  ): Promise<Room> {
    try {
      const updateData: Partial<typeof roomTable.$inferInsert> = {};

      if (roomUpdateParams.name !== undefined) {
        updateData.name = roomUpdateParams.name;
      }
      if (roomUpdateParams.capacity !== undefined) {
        updateData.capacity = roomUpdateParams.capacity;
      }
      if (roomUpdateParams.isEnabled !== undefined) {
        updateData.is_enabled = roomUpdateParams.isEnabled;
      }
      if (roomUpdateParams.building !== undefined) {
        updateData.building = roomUpdateParams.building;
      }
      if (roomUpdateParams.floor !== undefined) {
        updateData.floor = roomUpdateParams.floor;
      }

      const result = await this._db
        .update(roomTable)
        .set(updateData)
        .where(eq(roomTable.id, id))
        .returning();

      if (result.length === 0) {
        throw RoomError.updateFailed(
          `Failed to update room with ID "${id}".`,
        );
      }
      return this.transformRoom(result[0]);
    } catch (error: any) {
      if (error.cause.code === PostgresErrorCode.UNIQUE_VIOLATION) {
        throw RoomError.alreadyExists(
          `Room name "${roomUpdateParams.name}" already exists.`,
        );
      }
      throw RoomError.updateFailed(
        "Unexpected error during room update",
        error,
      );
    }
  }

  async deleteRoom(id: string): Promise<void> {
    try {
      await this._db.delete(roomTable).where(eq(roomTable.id, id));
    } catch (error: any) {
      throw RoomError.deletionFailed(
        `Failed to delete room with ID "${id}". The room is linked to courses. Please delete all the courses associated with this room or change their associated room before deleting this room.`,
        error,
      );
    }
  }

  async getDistinctBuildings(): Promise<string[]> {
    const result = await this._db
      .selectDistinct({ building: roomTable.building })
      .from(roomTable)
      .where(eq(roomTable.is_enabled, true))
      .orderBy(roomTable.building);

    return result.map((row) => row.building);
  }

  async getDistinctFloors(): Promise<number[]> {
    const result = await this._db
      .selectDistinct({ floor: roomTable.floor })
      .from(roomTable)
      .where(eq(roomTable.is_enabled, true))
      .orderBy(roomTable.floor);

    return result.map((row) => row.floor);
  }

  async getDistinctFloorsByBuilding(building: string): Promise<number[]> {
    const result = await this._db
      .selectDistinct({ floor: roomTable.floor })
      .from(roomTable)
      .where(
        and(
          eq(roomTable.is_enabled, true),
          eq(roomTable.building, building),
        ),
      )
      .orderBy(roomTable.floor);

    return result.map((row) => row.floor);
  }
}
