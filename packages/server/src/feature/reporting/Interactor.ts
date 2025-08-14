import { Service } from "typedi";
import { Equipment } from "../../../database/schema/equipment";
import { Report } from "../../../database/schema/reporting";
import { IReportingInteractor } from "./interface/IInteractor";
import { ReportingRepository } from "./Repository";
import { GetReportsQueryParams, Reporting } from "./validate";

@Service()
export class ReportingInteractor implements IReportingInteractor {
  constructor(private repository: ReportingRepository) { }

  async getReports(params: GetReportsQueryParams): Promise<Reporting[]> {
    return this.repository.getReports(params);
  }

  async findAllByRoomId(
    roomId: string,
  ): Promise<{ reporting: Report; equipment: Equipment | null }[]> {
    const reportings = await this.repository.findAllByRoomId(roomId);

    return reportings;
  }
}
