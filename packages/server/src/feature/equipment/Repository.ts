import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { IEquipmentRepository } from "./interface/IRepository";
import { database } from "../../../database/database";
import { equipmentTable } from "../../../database/schema/equipment";
import { eq } from "drizzle-orm";
import { Service } from "typedi";

@Service()
export class EquipmentRepository implements IEquipmentRepository {
  private db: NodePgDatabase<Record<string, never>>;

  constructor() {
    this.db = database;
  }

  async findAllByRoomId(roomId: string) {
    return this.db
      .select()
      .from(equipmentTable)
      .where(eq(equipmentTable.room_id, roomId));
  }
}
