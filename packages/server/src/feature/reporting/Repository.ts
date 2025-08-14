import { and, eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Service } from "typedi";
import { database } from "../../../database/database";
import { equipmentTable } from "../../../database/schema/equipment";
import { reportingTable } from "../../../database/schema/reporting";
import { IReportingRepository } from "./interface/IRepository";
import { dbReporting, GetReportsQueryParams, Reporting, ReportingFilter } from "./validate";

@Service()
export class ReportingRepository implements IReportingRepository {
  private db: NodePgDatabase<Record<string, never>>;
  constructor() {
    this.db = database;
  }

  private transformReporting(reporting: dbReporting): Reporting {
    return {
      id: reporting.id,
      equipmentId: reporting.equipment_id,
      description: reporting.description,
      status: reporting.status,
      createdDate: reporting.created_date,
    };
  }

  private applyFilter(filter: ReportingFilter | undefined, query: any) {
    const conditions: any[] = [];

    if (filter?.status) {
      conditions.push(eq(reportingTable.status, filter.status));
    }

    if (conditions.length) {
      query.where(and(...conditions));
    }

    return query;
  }

  async getReports(params: GetReportsQueryParams): Promise<Reporting[]> {
    const query = this.db.select().from(reportingTable);

    this.applyFilter({
      status: params.status,
    }, query);

    if (params.limit !== undefined) {
      query.limit(params.limit);
    }

    if (params.offset !== undefined) {
      query.offset(params.offset);
    }

    const result = await query;
    return result.map(reporting => this.transformReporting(reporting));
  }

  async findAllByRoomId(roomId: string) {
    return this.db
      .select()
      .from(reportingTable)
      .leftJoin(
        equipmentTable,
        eq(reportingTable.equipment_id, equipmentTable.id),
      )
      .where(eq(equipmentTable.room_id, roomId));
  }
}
