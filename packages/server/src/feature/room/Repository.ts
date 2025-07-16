import { eq, ilike, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Service } from "typedi";
import { database } from "../../../database/database";
import { roomTable } from "../../../database/schema/room";
import { RoomError } from "../../middleware/error/roomError";
import { IRoomRepository } from "./interface/IRepository";
import { CreateRoomParams, GetRoomsQueryParams, PutRoomParams, Room, RoomSearchParams } from "./validate";

@Service()
export class RoomRepository implements IRoomRepository {
  private _db: NodePgDatabase<Record<string, never>>;
  constructor() {
    this._db = database;
  }

  async create(RoomCreateParams: CreateRoomParams): Promise<Room> {
    try {
      const result = await this._db
        .insert(roomTable)
        .values({
          name: RoomCreateParams.name,
          capacity: RoomCreateParams.capacity,
          is_enabled: RoomCreateParams.is_enabled,
        })
        .returning();
      return result[0];
    } catch (error: any) {
      if (error.cause.code === "23505") {
        throw RoomError.alreadyExists(`Room name "${RoomCreateParams.name}" already exists.`);
      }
      throw RoomError.creationFailed("Unexpected error during room creation", error);
    }
  }

  async getRooms(params: GetRoomsQueryParams): Promise<Room[]> {
    const query = this._db.select().from(roomTable);
    if (params.search) {
      query.where(ilike(roomTable.name, `%${params.search}%`));
    }

    if (params.limit !== undefined) {
      query.limit(params.limit);
    }

    if (params.offset !== undefined) {
      query.offset(params.offset);
    }

    const result = await query;
    return result;
  }

  async getRoomsCount(params?: RoomSearchParams): Promise<number> {
    const query = this._db
      .select({ count: sql<number>`count(*)` })
      .from(roomTable);

    if (params?.search) {
      query.where(ilike(roomTable.name, `%${params.search}%`));
    }

    const result = await query;
    return Number(result[0].count);
  }

  async getRoom(id: string): Promise<Room | null> {
    const result = await this._db
      .select()
      .from(roomTable)
      .where(eq(roomTable.id, id))
      .limit(1);
    return result[0] || null;
  }

  async putRoom(id: string, roomUpdateParams: PutRoomParams): Promise<Room> {
    try {
      const updatedRoom = await this._db
        .update(roomTable)
        .set({
          name: roomUpdateParams.name,
          capacity: roomUpdateParams.capacity,
          is_enabled: roomUpdateParams.is_enabled,
        })
        .where(eq(roomTable.id, id))
        .returning();

      if (updatedRoom.length === 0) {
        throw RoomError.updateFailed(`Failed to update room with ID "${id}".`);
      }
      return updatedRoom[0];
    } catch (error: any) {
      if (error.cause.code === "23505") {
        throw RoomError.alreadyExists(`Room name "${roomUpdateParams.name}" already exists.`);
      }
      throw RoomError.updateFailed("Unexpected error during room update", error);
    }
  }

  async patchRoom(id: string, roomUpdateParams: Partial<PutRoomParams>): Promise<Room> {
    try {
      const result = await this._db
        .update(roomTable)
        .set(roomUpdateParams)
        .where(eq(roomTable.id, id))
        .returning();

      if (result.length === 0) {
        throw RoomError.updateFailed(`Failed to update room with ID "${id}".`);
      }
      return result[0];
    } catch (error: any) {
      if (error.cause.code === "23505") {
        throw RoomError.alreadyExists(`Room name "${roomUpdateParams.name}" already exists.`);
      }
      throw RoomError.updateFailed("Unexpected error during room update", error);
    }
  }

  async deleteRoom(id: string): Promise<void> {
    await this._db
      .delete(roomTable)
      .where(eq(roomTable.id, id));
  }
}
