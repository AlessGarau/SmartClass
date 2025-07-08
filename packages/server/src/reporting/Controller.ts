import { Service } from "typedi";
import { ReportingInteractor } from "./Interactor";
import { FastifyReply, FastifyRequest } from "fastify";

@Service()
export class ReportingController {
  constructor(private interactor: ReportingInteractor) {}

  async findAllReportByRoomId(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const roomId = req.params.id;
    const reportings = await this.interactor.findAllByRoomId(roomId);
    reply.status(200).send({
      data: reportings,
      message: "Signalement récupéré avec succès",
    });
  }
}
