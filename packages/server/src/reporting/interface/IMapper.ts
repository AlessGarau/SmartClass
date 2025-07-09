import { Equipment } from "../../../database/schema/equipment";
import { Report } from "../../../database/schema/reporting";
import { ReportingByRoomResponse } from "../validate";
export interface IMapper {
  toResponse(input: { reporting: Report; equipment: Equipment }): ReportingByRoomResponse;
}
