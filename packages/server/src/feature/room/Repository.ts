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
  dbRoom,
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

  private applyFilter(filter: RoomFilter, query: any): void {
    if (!filter) { return; }

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

  async getRooms(params: GetRoomsQueryParams): Promise<Room[]> {
    const query = this._db.select().from(roomTable);

    this.applyFilter({
      search: params.search,
      isEnabled: params.isEnabled,
      building: params.building,
      floor: params.floor,
    }, query);

    if (params.limit !== undefined) {
      query.limit(params.limit);
    }

    if (params.offset !== undefined) {
      query.offset(params.offset);
    }

    const result = await query;
    return result.map(room => this.transformRoom(room));
  }

  async getRoomsCount(filter: RoomFilter): Promise<number> {
    const query = this._db
      .select({ count: sql<number>`count(*)` })
      .from(roomTable);

    this.applyFilter(filter, query);

    const result = await query;
    return Number(result[0].count);
  }

  async getRoom(id: string): Promise<Room | null> {
    const result = await this._db
      .select()
      .from(roomTable)
      .where(eq(roomTable.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.transformRoom(result[0]);
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

  async patchRoom(id: string, roomUpdateParams: PatchRoomParams): Promise<Room> {
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
}