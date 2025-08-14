import { Service } from "typedi";
import { Equipment } from "../../../database/schema/equipment";
import { Report } from "../../../database/schema/reporting";
import { ReportingError } from "../../middleware/error/reportingError";
import { IReportingInteractor } from "./interface/IInteractor";
import { ReportingRepository } from "./Repository";
import { GetReportsQueryParams, PatchReportingParams, Reporting, ReportingFilter } from "./validate";

@Service()
export class ReportingInteractor implements IReportingInteractor {
  constructor(private _repository: ReportingRepository) { }

  async getReports(params: GetReportsQueryParams): Promise<Reporting[]> {
    return this._repository.getReports(params);
  }

  async getReportsCount(params: ReportingFilter): Promise<number> {
    return this._repository.getReportsCount(params);
  }

  async patchReporting(id: string, patchReportingParams: PatchReportingParams): Promise<Reporting> {
    const existingReporting: Reporting | null = await this._repository.getReporting(id);
    if (!existingReporting) {
      throw ReportingError.notFound(`Reporting with ID "${id}" not found.`);
    }
    const updatedReporting: Reporting = await this._repository.patchReporting(id, patchReportingParams);
    if (!updatedReporting) {
      throw ReportingError.updateFailed();
    }
    return updatedReporting;
  }

  async findAllByRoomId(
    roomId: string,
  ): Promise<{ reporting: Report; equipment: Equipment | null }[]> {
    const reportings = await this._repository.findAllByRoomId(roomId);

    return reportings;
  }
}
