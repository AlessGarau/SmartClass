import { GetReportsQueryParams, Reporting } from "../validate";

export interface IReportingInteractor {
  findAllByRoomId(roomId: string): Promise<any>;
  getReports(params: GetReportsQueryParams): Promise<Reporting[]>;
}
