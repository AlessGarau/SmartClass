import { FastifyReply, FastifyRequest } from "fastify";
import { Service } from "typedi";
import { ClassInteractor } from "./Interactor";
import { ClassMapper } from "./Mapper";
import { ClassMessage } from "./message";
import { Class, ClassFilterSchema, ClassIdParamsSchema, CreateClassParams, CreateClassSchema, GetClassesQuerySchema, PatchClassSchema, PutClassSchema } from "./validate";

@Service()
export class ClassController {
  constructor(
    private _interactor: ClassInteractor,
    private _mapper: ClassMapper,
  ) { }

  async createClass(req: FastifyRequest, reply: FastifyReply) {
    const classCreateParams: CreateClassParams = CreateClassSchema.parse(req.body);
    const createdClass: Class = await this._interactor.createClass(
      classCreateParams,
    );
    return reply.status(201).send({
      data: this._mapper.toGetClassResponse(createdClass),
      message: ClassMessage.CREATION_SUCCESS,
    });
  }


  async getClasses(req: FastifyRequest, reply: FastifyReply) {
    const { limit, offset, search } = GetClassesQuerySchema.parse(req.query);
    const classes = await this._interactor.getClasses({
      limit,
      offset,
      search,
    });

    return reply.status(200).send({
      data: this._mapper.toGetClassesResponse(classes),
    });
  }

  async getClass(req: FastifyRequest, reply: FastifyReply) {
    const { id } = ClassIdParamsSchema.parse(req.params);
    const room = await this._interactor.getClass(id);
    return reply.status(200).send({
      data: this._mapper.toGetClassResponse(room),
    });
  }

  async getClassesCount(req: FastifyRequest, reply: FastifyReply) {
    const filter = ClassFilterSchema.parse(req.query);
    const total = await this._interactor.getClassesCount(filter);
    return reply.status(200).send({
      data: this._mapper.toGetTotalClassesResponse(total),
    });
  }

  async putClass(req: FastifyRequest, reply: FastifyReply) {
    const { id } = ClassIdParamsSchema.parse(req.params);
    const classUpdateParams = PutClassSchema.parse(req.body);
    const updatedClass = await this._interactor.putClass(id, classUpdateParams);
    return reply.status(200).send({
      data: this._mapper.toGetClassResponse(updatedClass),
      message: ClassMessage.UPDATE_SUCCESS,
    });
  }

  async patchClass(req: FastifyRequest, reply: FastifyReply) {
    const { id } = ClassIdParamsSchema.parse(req.params);
    const classUpdateParams = PatchClassSchema.parse(req.body);
    const updatedClass = await this._interactor.patchClass(id, classUpdateParams);
    return reply.status(200).send({
      data: this._mapper.toGetClassResponse(updatedClass),
      message: ClassMessage.UPDATE_SUCCESS,
    });
  }

  async deleteClass(req: FastifyRequest, reply: FastifyReply) {
    const { id } = ClassIdParamsSchema.parse(req.params);
    await this._interactor.deleteClass(id);
    return reply.status(204).send();
  }
}
