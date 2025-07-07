import { IRoomRepository } from "./interface/IRepository";
import { RoomCreateParams, Room } from "./validate";
import { database } from "../../database/database";
import { Service } from "typedi";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { roomTable } from "../../database/schema/room";

@Service()
export class RoomRepository implements IRoomRepository {
  private db: NodePgDatabase<Record<string, never>>;
  constructor() {
    this.db = database;
  }
  async create(RoomCreateParams: RoomCreateParams): Promise<Room> {
    const result = await this.db.insert(roomTable).values({
      name: RoomCreateParams.name,
      capacity: 10,
      is_enabled: true,
    }).returning();
    return result[0];
  }
}
