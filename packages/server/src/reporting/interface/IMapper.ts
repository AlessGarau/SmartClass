import { Equipment } from "../../../database/schema/equipment";
import { Report } from "../../../database/schema/reporting";

export interface ReportingByRoomResponse {
  reporting: {
    id: string;
    equipmentId: string;
    description: string;
    status: string;
    createdDate: Date;
  };
  equipment: {
    id: string;
    type: string;
    isFunctional: boolean;
    isRunning: boolean;
    roomId: string;
  } | null;
}
export interface IMapper {
  toResponse(input: { reporting: Report; equipment: Equipment }): ReportingByRoomResponse;
}
