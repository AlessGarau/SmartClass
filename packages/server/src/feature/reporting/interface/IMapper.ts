import { Equipment } from "../../../../database/schema/equipment";
import { Report } from "../../../../database/schema/reporting";
import { Reporting, ReportingByRoomResponse } from "../validate";

export { ReportingByRoomResponse };

export interface IMapper {
  toGetReportsResponse(reports: Reporting[]): Reporting[];
  toResponse(input: { reporting: Report; equipment: Equipment }): ReportingByRoomResponse;
}
