import { Service } from "typedi";
import { EquipmentInteractor } from "./Interactor";
import { FastifyReply, FastifyRequest } from "fastify";
import { EquipmentMapper } from "./Mapper";

@Service()
export class EquipmentController {
  constructor(private interactor: EquipmentInteractor, private mapper: EquipmentMapper) {}

  async findAllEquipmentByRoomId(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const roomId = req.params.id;
    const equipments = await this.interactor.findAllByRoomId(roomId);
    const data = equipments.map(equipment => this.mapper.toResponse(equipment));
    reply.status(200).send({
      data,
      message: "Équipements récupérés avec succès",
    });
  }
}
