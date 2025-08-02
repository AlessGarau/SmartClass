import { FastifyReply, FastifyRequest } from "fastify";
import { Service } from "typedi";
import { RoomInteractor } from "./Interactor";
import { RoomMapper } from "./Mapper";
import { RoomMessage } from "./message";
import {
  CreateRoomParams,
  CreateRoomSchema,
  GetRoomsQuerySchema,
  PatchRoomSchema,
  PutRoomSchema,
  Room,
  RoomFilterSchema,
  RoomIdParamsSchema,
} from "./validate";

@Service()
export class RoomController {
  constructor(
    private _interactor: RoomInteractor,
    private _mapper: RoomMapper,
  ) { }

  async createRoom(req: FastifyRequest, reply: FastifyReply) {
    const roomCreateParams: CreateRoomParams = CreateRoomSchema.parse(req.body);
    const createdRoom: Room = await this._interactor.createRoom(
      roomCreateParams,
    );
    return reply.status(201).send({
      data: this._mapper.toGetRoomResponse(createdRoom),
      message: RoomMessage.CREATION_SUCCESS,
    });
  }

  async getRooms(req: FastifyRequest, reply: FastifyReply) {
    const { limit, offset, isEnabled, search } = GetRoomsQuerySchema.parse(req.query);
    const rooms = await this._interactor.getRooms({
      limit,
      offset,
      isEnabled,
      search,
    });
    return reply.status(200).send({
      data: this._mapper.toGetRoomsResponse(rooms),
    });
  }

  async getRoom(req: FastifyRequest, reply: FastifyReply) {
    const { id } = RoomIdParamsSchema.parse(req.params);
    const room = await this._interactor.getRoom(id);
    return reply.status(200).send({
      data: this._mapper.toGetRoomResponse(room),
    });
  }

  async putRoom(req: FastifyRequest, reply: FastifyReply) {
    const { id } = RoomIdParamsSchema.parse(req.params);
    const roomUpdateParams = PutRoomSchema.parse(req.body);
    const updatedRoom = await this._interactor.putRoom(id, roomUpdateParams);
    return reply.status(200).send({
      data: this._mapper.toGetRoomResponse(updatedRoom),
      message: RoomMessage.UPDATE_SUCCESS,
    });
  }

  async patchRoom(req: FastifyRequest, reply: FastifyReply) {
    const { id } = RoomIdParamsSchema.parse(req.params);
    const roomUpdateParams = PatchRoomSchema.parse(req.body);
    const updatedRoom = await this._interactor.patchRoom(id, roomUpdateParams);
    return reply.status(200).send({
      data: this._mapper.toGetRoomResponse(updatedRoom),
      message: RoomMessage.UPDATE_SUCCESS,
    });
  }

  async getRoomsCount(req: FastifyRequest, reply: FastifyReply) {
    const filter = RoomFilterSchema.parse(req.query);
    const total = await this._interactor.getRoomsCount(filter);
    return reply.status(200).send({
      data: this._mapper.toGetTotalRoomsResponse(total),
    });
  }

  async deleteRoom(req: FastifyRequest, reply: FastifyReply) {
    const { id } = RoomIdParamsSchema.parse(req.params);
    await this._interactor.deleteRoom(id);
    return reply.status(204).send();
  }
}
