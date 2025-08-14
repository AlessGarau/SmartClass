import { GetReportsQueryParams, Reporting } from "../validate";

export interface IReportingRepository {
  findAllByRoomId(roomId: string): Promise<any>;
  getReports(params: GetReportsQueryParams): Promise<Reporting[]>;
}
