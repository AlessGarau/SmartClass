import { FastifyReply, FastifyRequest } from "fastify";
import { Service } from "typedi";
import { ReportingInteractor } from "./Interactor";
import { ReportingMapper } from "./Mapper";
import { GetReportsQuerySchema } from "./validate";

@Service()
export class ReportingController {
  constructor(private _interactor: ReportingInteractor, private _mapper: ReportingMapper) { }

  async getReports(req: FastifyRequest, reply: FastifyReply) {
    const { limit, offset, status } = GetReportsQuerySchema.parse(req.query);
    const reports = await this._interactor.getReports({
      limit,
      offset,
      status,
    });

    return reply.status(200).send({
      data: this._mapper.toGetReportsResponse(reports),
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
}
