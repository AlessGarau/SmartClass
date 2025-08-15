import { and, eq, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Service } from "typedi";
import { database } from "../../../database/database";
import { equipmentTable } from "../../../database/schema/equipment";
import { reportingTable } from "../../../database/schema/reporting";
import { ReportingError } from "../../middleware/error/reportingError";
import { IReportingRepository } from "./interface/IRepository";
import { CreateReportingParams, dbReporting, GetReportsQueryParams, PatchReportingParams, Reporting, ReportingFilter } from "./validate";

@Service()
export class ReportingRepository implements IReportingRepository {
  private _db: NodePgDatabase<Record<string, never>>;
  constructor() {
    this._db = database;
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

  async create(ReportingCreateParams: CreateReportingParams): Promise<Reporting> {
    try {
      const result = await this._db
        .insert(reportingTable)
        .values({
          equipment_id: ReportingCreateParams.equipmentId,
          description: ReportingCreateParams.description,
        })
        .returning();
      return this.transformReporting(result[0]);
    } catch (error: any) {
      throw ReportingError.creationFailed(
        "Unexpected error during reporting creation, check if the equipmentId exists",
        error,
      );
    }
  }

  async getReports(params: GetReportsQueryParams): Promise<Reporting[]> {
    const query = this._db.select().from(reportingTable);

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
    return this._db
      .select()
      .from(reportingTable)
      .leftJoin(
        equipmentTable,
        eq(reportingTable.equipment_id, equipmentTable.id),
      )
      .where(eq(equipmentTable.room_id, roomId));
  }

  async getReportsCount(filter: ReportingFilter): Promise<number> {
    const query = this._db
      .select({ count: sql<number>`count(*)` })
      .from(reportingTable);

    this.applyFilter(filter, query);

    const result = await query;
    return Number(result[0].count);
  }

  async getReporting(id: string): Promise<Reporting | null> {
    const result = await this._db
      .select()
      .from(reportingTable)
      .where(and(eq(reportingTable.id, id)))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.transformReporting(result[0]);
  }

  async patchReporting(id: string, reportingUpdateParams: PatchReportingParams): Promise<Reporting> {
    try {
      const updateData: Partial<typeof reportingTable.$inferInsert> = {};

      if (reportingUpdateParams.status !== undefined) {
        updateData.status = reportingUpdateParams.status;
      }

      const result = await this._db
        .update(reportingTable)
        .set(updateData)
        .where(and(eq(reportingTable.id, id)))
        .returning({
          id: reportingTable.id,
          equipment_id: reportingTable.equipment_id,
          description: reportingTable.description,
          status: reportingTable.status,
          created_date: reportingTable.created_date,
        });

      if (result.length === 0) {
        throw ReportingError.updateFailed(`Failed to update reporting with ID "${id}".`);
      }

      return this.transformReporting(result[0]);
    } catch (error: any) {
      throw ReportingError.updateFailed(
        "Unexpected error during reporting update",
        error,
      );
    }
  }
}
