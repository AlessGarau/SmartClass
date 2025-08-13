import { and, eq, ilike, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Service } from "typedi";
import { database } from "../../../database/database";
import { roomTable } from "../../../database/schema/room";
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
import {
  temperatureTable,
  humidityTable,
  pressureTable,
  movementTable,
} from "../../../database/schema";

@Service()
export class RoomRepository implements IRoomRepository {
  private _db: NodePgDatabase<Record<string, never>>;
  constructor() {
    this._db = database;
  }
  private _selectedFields = {
    id: roomTable.id,
    name: roomTable.name,
    capacity: roomTable.capacity,
    building: roomTable.building,
    floor: roomTable.floor,
    is_enabled: roomTable.is_enabled,
    temperature: temperatureTable.data,
    humidity: humidityTable.data,
    pressure: pressureTable.data,
    movement: movementTable.data,
  } as const;

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
    temperature: row.temperature,
    humidity: row.humidity,
    pressure: row.pressure,
    movement: row.movement,
  });

  private addJoins(query: any) {
    return query
      .leftJoin(temperatureTable, eq(temperatureTable.room_id, roomTable.id))
      .leftJoin(humidityTable, eq(humidityTable.room_id, roomTable.id))
      .leftJoin(pressureTable, eq(pressureTable.room_id, roomTable.id))
      .leftJoin(movementTable, eq(movementTable.room_id, roomTable.id));
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
      if (error.cause.code === "23505") {
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

  async getRooms(params: GetRoomsQueryParams): Promise<RoomWithMetrics[]> {
    const query = this._db.select(this._selectedFields).from(roomTable);

    this.addJoins(query);

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

    const result = await query;
    return result.map((room) => this.transformRoomWithMetrics(room));
  }

  async getRoomsCount(filter: RoomFilter): Promise<number> {
    const query = this._db
      .select({ count: sql<number>`count(*)` })
      .from(roomTable);

    this.applyFilter(filter, query);

    const result = await query;
    return Number(result[0].count);
  }

  async getRoom(id: string): Promise<RoomWithMetrics | null> {
    const query = this._db
      .select(this._selectedFields)
      .from(roomTable)
      .where(eq(roomTable.id, id));

    this.addJoins(query).limit(1);

    const room = await query;
    if (room.length === 0) {
      return null;
    }

    return this.transformRoomWithMetrics(room[0]);
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
        throw RoomError.updateFailed(`Failed to update room with ID "${id}".`);
      }
      return this.transformRoom(updatedRoom[0]);
    } catch (error: any) {
      if (error.cause.code === "23505") {
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
        throw RoomError.updateFailed(`Failed to update room with ID "${id}".`);
      }
      return this.transformRoom(result[0]);
    } catch (error: any) {
      if (error.cause.code === "23505") {
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
}
