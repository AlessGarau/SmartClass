import { Service } from "typedi";
import { ReportingInteractor } from "./Interactor";
import { FastifyReply, FastifyRequest } from "fastify";
import { ReportingMapper } from "./Mapper";

@Service()
export class ReportingController {
  constructor(private interactor: ReportingInteractor, private mapper: ReportingMapper) {}

  async findAllReportByRoomId(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const roomId = req.params.id;
    const reportings = await this.interactor.findAllByRoomId(roomId);
    const data = reportings.map(r => this.mapper.toResponse(r));
    reply.status(200).send({
      data,
      message: "Signalement récupéré avec succès",
    });
  }
}
