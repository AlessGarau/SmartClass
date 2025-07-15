import { FastifyReply, FastifyRequest } from "fastify";
import { Service } from "typedi";
import { RoomInteractor } from "./Interactor";
import { RoomMessage } from "./message";
import { CreateRoomParams, CreateRoomSchema, GetRoomsQuerySchema, PatchRoomSchema, PutRoomSchema, Room, RoomIdParamsSchema } from "./validate";

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
    const { limit, offset, search } = GetRoomsQuerySchema.parse(req.query);
    const rooms = await this._interactor.getRooms({ limit, offset, search });
    return reply.status(200).send({
      data: rooms,
    });
  }

  async getRoom(req: FastifyRequest, reply: FastifyReply) {
    const { id } = RoomIdParamsSchema.parse(req.params);
    const room = await this._interactor.getRoom(id);
    return reply.status(200).send({
      data: room,
    });
  }

  async putRoom(req: FastifyRequest, reply: FastifyReply) {
    const { id } = RoomIdParamsSchema.parse(req.params);
    const roomUpdateParams = PutRoomSchema.parse(req.body);
    const updatedRoom = await this._interactor.putRoom(id, roomUpdateParams);
    return reply.status(200).send({
      data: updatedRoom,
      message: RoomMessage.UPDATE_SUCCESS,
    });
  }

  async patchRoom(req: FastifyRequest, reply: FastifyReply) {
    const { id } = RoomIdParamsSchema.parse(req.params);
    const roomUpdateParams = PatchRoomSchema.parse(req.body);
    const updatedRoom = await this._interactor.patchRoom(id, roomUpdateParams);
    return reply.status(200).send({
      data: updatedRoom,
      message: RoomMessage.UPDATE_SUCCESS,
    });
  }

  async deleteRoom(req: FastifyRequest, reply: FastifyReply) {
    const { id } = RoomIdParamsSchema.parse(req.params);
    await this._interactor.deleteRoom(id);
    return reply.status(204).send();
  }
}
