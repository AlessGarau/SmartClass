import { CreateReportingParams, GetReportsQueryParams, PatchReportingParams, Reporting, ReportingFilter } from "../validate";

export interface IReportingRepository {
  create(ReportingCreateParams: CreateReportingParams): Promise<Reporting>;
  findAllByRoomId(roomId: string): Promise<any>;
  getReports(params: GetReportsQueryParams): Promise<Reporting[]>;
  getReportsCount(filter: ReportingFilter): Promise<number>;
  getReporting(id: string): Promise<Reporting | null>;
  patchReporting(id: string, patchReportingParams: PatchReportingParams): Promise<Reporting | null>;
  deleteReporting(id: string): Promise<void>;
}
