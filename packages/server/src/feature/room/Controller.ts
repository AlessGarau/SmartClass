import { FastifyReply, FastifyRequest } from "fastify";
import { Service } from "typedi";
import { RoomInteractor } from "./Interactor";
import { RoomCreateSchema } from "./validate";

@Service()
export class RoomController {
  constructor(private interactor: RoomInteractor) { }

  async createRoom(req: FastifyRequest, reply: FastifyReply) {
    const roomCreateParams = RoomCreateSchema.parse(req.body);

    const createdRoom = await this.interactor.createRoom(roomCreateParams);

    return reply.status(201).send({
      data: createdRoom,
      message: "Salle créée avec succès",
    });
  }

  async getRooms(req: FastifyRequest, reply: FastifyReply) {
    const rooms = await this.interactor.getRooms();
    return reply.status(200).send({
      data: rooms,
    });
  }
}
