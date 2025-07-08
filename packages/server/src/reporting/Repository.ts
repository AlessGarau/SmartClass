import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { IReportingRepository } from "./interface/IRepository";
import { database } from "../../database/database";
import { reportingTable } from "../../database/schema/reporting";
import { equipmentTable } from "../../database/schema/equipment";
import { eq } from "drizzle-orm";
import { Service } from "typedi";

@Service()
export class ReportingRepository implements IReportingRepository {
  private db: NodePgDatabase<Record<string, never>>;
  constructor() {
    this.db = database;
  }

  async findAllByRoomId(roomId: string) {
    return this.db
      .select()
      .from(reportingTable)
      .leftJoin(
        equipmentTable,
        eq(reportingTable.equipment_id, equipmentTable.id)
      )
      .where(eq(equipmentTable.room_id, roomId));
  }
}
