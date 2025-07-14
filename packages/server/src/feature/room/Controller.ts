import { FastifyReply, FastifyRequest } from "fastify";
import { Service } from "typedi";
import { RoomInteractor } from "./Interactor";
import { Room, CreateRoomParams, CreateRoomSchema, GetRoomsQuerySchema, GetRoomParamsSchema } from "./validate";
import { RoomMessage } from "./message";

@Service()
export class RoomController {
  constructor(private _interactor: RoomInteractor) { }

  async createRoom(req: FastifyRequest, reply: FastifyReply) {
    const roomCreateParams: CreateRoomParams = CreateRoomSchema.parse(req.body);
    const createdRoom: Room = await this._interactor.createRoom(roomCreateParams);
    return reply.status(201).send({
      data: createdRoom,
      message: RoomMessage.CREATION_SUCCESS,
    });
  }

  async getRooms(req: FastifyRequest, reply: FastifyReply) {
    const { limit, offset } = GetRoomsQuerySchema.parse(req.query);
    const rooms = await this._interactor.getRooms({ limit, offset });
    return reply.status(200).send({
      data: rooms,
    });
  }

  async getRoom(req: FastifyRequest, reply: FastifyReply) {
    const { id } = GetRoomParamsSchema.parse(req.params);
    const room = await this._interactor.getRoom(id);
    console.log("Room fetched:", !room);
    if (!room) {
      return reply.status(404).send({
        error: RoomMessage.NOT_FOUND,
      });
    }
    return reply.status(200).send({
      data: room,
    });
  }
}
