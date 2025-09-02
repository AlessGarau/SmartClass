import { FastifyReply, FastifyRequest } from "fastify";
import { Service } from "typedi";
import { ReportingInteractor } from "./Interactor";
import { ReportingMapper } from "./Mapper";
import { ReportingMessage } from "./message";
import { CreateReportingParams, CreateReportingSchema, PatchReportingSchema, Reporting, ReportingFilterSchema, ReportingIdParamsSchema } from "./validate";

@Service()
export class ReportingController {
  constructor(private _interactor: ReportingInteractor, private _mapper: ReportingMapper) { }

  async createReporting(req: FastifyRequest, reply: FastifyReply) {
    const reportingCreateParams: CreateReportingParams = CreateReportingSchema.parse(req.body);
    const createdReporting: Reporting = await this._interactor.createReporting(
      reportingCreateParams,
    );
    return reply.status(201).send({
      data: this._mapper.toGetReportingResponse(createdReporting),
      message: ReportingMessage.CREATION_SUCCESS,
    });
  }

  async getReports(req: FastifyRequest, reply: FastifyReply) {
    const filter = ReportingFilterSchema.parse(req.query);
    const reports = await this._interactor.getReports(filter);
    return reply.status(200).send({
      data: this._mapper.toGetReportsResponse(reports),
    });
  }

  async patchReporting(req: FastifyRequest, reply: FastifyReply) {
    const { id } = ReportingIdParamsSchema.parse(req.params);
    const reportingUpdateParams = PatchReportingSchema.parse(req.body);
    const updatedReporting = await this._interactor.patchReporting(id, reportingUpdateParams);
    return reply.status(200).send({
      data: this._mapper.toGetReportingResponse(updatedReporting),
      message: ReportingMessage.UPDATE_SUCCESS,
    });
  }

  async getReportsCount(req: FastifyRequest, reply: FastifyReply) {
    const filter = ReportingFilterSchema.parse(req.query);
    const total = await this._interactor.getReportsCount(filter);
    return reply.status(200).send({
      data: this._mapper.toGetTotalReportsResponse(total),
    });
  }

  async findAllReportByRoomId(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const roomId = req.params.id;
    const reportings = await this._interactor.findAllByRoomId(roomId);
    const data = reportings.map(r => this._mapper.toResponse(r));
    reply.status(200).send({
      data,
      message: "Signalement récupéré avec succès",
    });
  }

  async deleteReporting(req: FastifyRequest, reply: FastifyReply) {
    const { id } = ReportingIdParamsSchema.parse(req.params);
    await this._interactor.deleteReporting(id);
    return reply.status(204).send();
  }
}
