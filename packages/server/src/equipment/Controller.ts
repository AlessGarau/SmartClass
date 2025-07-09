import { Service } from "typedi";
import { EquipmentInteractor } from "./Interactor";
import { FastifyReply, FastifyRequest } from "fastify";
import { EquipmentMapper } from "./Mapper";
import { equipmentParamsSchema } from "./validate";

@Service()
export class EquipmentController {
  constructor(private interactor: EquipmentInteractor, private mapper: EquipmentMapper) {}

  async findAllEquipmentByRoomId(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id: roomId } = equipmentParamsSchema.parse(req.params);
    
    const equipments = await this.interactor.findAllByRoomId(roomId);
    const data = equipments.map(equipment => this.mapper.toResponse(equipment));
    reply.status(200).send({
      data,
      message: "Équipements récupérés avec succès",
    });
  }
}
