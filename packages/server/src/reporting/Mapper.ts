import { Service } from "typedi";
import { IMapper, ReportingByRoomResponse } from "./interface/IMapper";

@Service()
export class ReportingMapper implements IMapper {
  toResponse({ reporting, equipment }: { reporting: any; equipment: any }): ReportingByRoomResponse {
    return {
      reporting: {
        id: reporting.id,
        equipmentId: reporting.equipment_id,
        description: reporting.description,
        status: reporting.status,
        createdDate: reporting.created_date,
      },
      equipment: equipment
        ? {
            id: equipment.id,
            type: equipment.type,
            isFunctional: equipment.is_functional,
            isRunning: equipment.is_running,
            roomId: equipment.room_id,
          }
        : null,
    };
  }
}
