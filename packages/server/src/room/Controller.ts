import { FastifyReply, FastifyRequest } from "fastify";
import { RoomCreateSchema } from "./validate";
import { RoomInteractor } from "./Interactor";
import { Service } from "typedi";

@Service()
export class RoomController {
  constructor(private interactor: RoomInteractor) {}

  async createRoom(req: FastifyRequest, reply: FastifyReply) {
    try {
      const roomCreateParams = RoomCreateSchema.parse(req.body);

      const createdRoom = await this.interactor.createRoom(roomCreateParams);

      return reply.status(201).send({
        data: createdRoom,
        message: "Salle créée avec succès",
      });
    } catch (error) {
      throw error;
    }
  }
}
