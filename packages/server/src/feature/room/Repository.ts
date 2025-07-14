import { IRoomRepository } from "./interface/IRepository";
import { CreateRoomParams, Room, GetRoomsQueryParams } from "./validate";
import { database } from "../../../database/database";
import { Service } from "typedi";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { roomTable } from "../../../database/schema/room";
import { eq } from "drizzle-orm";
import { RoomError } from "../../middleware/error/roomError";

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
          is_enabled: true,
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

    if (params.limit !== undefined) {
      query.limit(params.limit);
    }

    if (params.offset !== undefined) {
      query.offset(params.offset);
    }

    const result = await query;
    return result;
  }

  async getRoom(id: string): Promise<Room | null> {
    const result = await this._db
      .select()
      .from(roomTable)
      .where(eq(roomTable.id, id))
      .limit(1);
    return result[0] || null;
  }

  async deleteRoom(id: string): Promise<void> {
    await this._db
      .delete(roomTable)
      .where(eq(roomTable.id, id));
  }
}
