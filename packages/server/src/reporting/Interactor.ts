import { Service } from "typedi";
import { IReportingInteractor } from "./interface/IInteractor";
import { ReportingRepository } from "./Repository";
import { Report } from "../../database/schema/reporting";
import { Equipment } from "../../database/schema/equipment";

@Service()
export class ReportingInteractor implements IReportingInteractor {
  constructor(private repository: ReportingRepository) {}

  async findAllByRoomId(
    roomId: string
  ): Promise<{ reporting: Report; equipment: Equipment | null }[]> {
    const reportings = await this.repository.findAllByRoomId(roomId);

    return reportings;
  }
}
