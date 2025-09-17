import { CreateReportingParams, GetReportsQueryParams, PatchReportingParams, Reporting, ReportingFilter } from "../validate";

export interface IReportingInteractor {
  findAllByRoomId(roomId: string): Promise<any>;
  createReporting(CreateReportingParams: CreateReportingParams): Promise<Reporting>;
  getReports(params: GetReportsQueryParams): Promise<Reporting[]>;
  getReportsCount(search?: ReportingFilter): Promise<number>;
  patchReporting(id: string, reportingUpdateParams: PatchReportingParams): Promise<Reporting>;
  deleteReporting(id: string): Promise<void>;
}
