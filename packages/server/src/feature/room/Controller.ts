import { FastifyReply, FastifyRequest } from "fastify";
import { Service } from "typedi";
import { RoomInteractor } from "./Interactor";
import { Room, RoomCreateParams, RoomCreateSchema } from "./validate";
import { RoomMessage } from "./message";

@Service()
export class RoomController {
  constructor(private _interactor: RoomInteractor) { }

  async createRoom(req: FastifyRequest, reply: FastifyReply) {
    const roomCreateParams: RoomCreateParams = RoomCreateSchema.parse(req.body);
    const createdRoom: Room = await this._interactor.createRoom(roomCreateParams);
    return reply.status(201).send({
      data: createdRoom,
      message: RoomMessage.CREATION_SUCCESS,
    });
  }

  async getRooms(req: FastifyRequest, reply: FastifyReply) {
    const rooms = await this._interactor.getRooms();
    return reply.status(200).send({
      data: rooms,
    });
  }
}
