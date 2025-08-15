import { Equipment } from "../../../../database/schema/equipment";
import { Report } from "../../../../database/schema/reporting";
import { Count, Reporting, ReportingByRoomResponse } from "../validate";

export { ReportingByRoomResponse };

export interface IMapper {
  toGetReportsResponse(reports: Reporting[]): Reporting[];
  toGetReportingResponse(reporting: Reporting): Reporting;
  toGetTotalReportsResponse(total: number): Count
  toResponse(input: { reporting: Report; equipment: Equipment }): ReportingByRoomResponse;
}
