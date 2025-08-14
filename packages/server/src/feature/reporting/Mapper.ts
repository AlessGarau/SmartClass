import { Service } from "typedi";
import { IMapper } from "./interface/IMapper";
import { Count, Reporting, ReportingByRoomResponse } from "./validate";

@Service()
export class ReportingMapper implements IMapper {
  toGetReportsResponse(reports: Reporting[]): Reporting[] {
    return reports.map(report => ({
      id: report.id,
      equipmentId: report.equipmentId,
      description: report.description,
      status: report.status,
      createdDate: report.createdDate,
    }));
  }

  toGetReportingResponse(reporting: Reporting): Reporting {
    return {
      id: reporting.id,
      equipmentId: reporting.equipmentId,
      description: reporting.description,
      status: reporting.status,
      createdDate: reporting.createdDate,
    };
  }

  toGetTotalReportsResponse(total: number): Count {
    return { count: total };
  }

  toResponse({ reporting, equipment }: { reporting: any; equipment: any }): ReportingByRoomResponse {
    return {
      reporting: {
        id: reporting.id,
        equipmentId: reporting.equipmentId,
        description: reporting.description,
        status: reporting.status,
        createdDate: reporting.createdDate,
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
