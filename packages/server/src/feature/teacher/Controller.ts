import { FastifyReply, FastifyRequest } from "fastify";
import { Service } from "typedi";
import { TeacherInteractor } from "./Interactor";
import { TeacherMapper } from "./Mapper";
import { TeacherMessage } from "./message";
import { CreateTeacherParams, CreateTeacherSchema, GetTeachersQuerySchema, PatchTeacherSchema, PutTeacherSchema, Teacher, TeacherFilterSchema, TeacherIdParamsSchema } from "./validate";

@Service()
export class TeacherController {
  constructor(
    private _interactor: TeacherInteractor,
    private _mapper: TeacherMapper,
  ) { }

  async createTeacher(req: FastifyRequest, reply: FastifyReply) {
    const teacherCreateParams: CreateTeacherParams = CreateTeacherSchema.parse(req.body);
    const createdTeacher: Teacher = await this._interactor.createTeacher(
      teacherCreateParams,
    );
    return reply.status(201).send({
      data: this._mapper.toGetTeacherResponse(createdTeacher),
      message: TeacherMessage.CREATION_SUCCESS,
    });
  }

  async getTeachers(req: FastifyRequest, reply: FastifyReply) {
    const { limit, offset, search } = GetTeachersQuerySchema.parse(req.query);
    const teachers = await this._interactor.getTeachers({
      limit,
      offset,
      search,
    });

    return reply.status(200).send({
      data: this._mapper.toGetTeachersResponse(teachers),
    });
  }

  async getTeachersCount(req: FastifyRequest, reply: FastifyReply) {
    const filter = TeacherFilterSchema.parse(req.query);
    const total = await this._interactor.getTeachersCount(filter);
    return reply.status(200).send({
      data: this._mapper.toGetTotalTeachersResponse(total),
    });
  }

  async getTeacher(req: FastifyRequest, reply: FastifyReply) {
    const { id } = TeacherIdParamsSchema.parse(req.params);
    const teacher = await this._interactor.getTeacher(id);
    return reply.status(200).send({
      data: this._mapper.toGetTeacherResponse(teacher),
    });
  }

  async putTeacher(req: FastifyRequest, reply: FastifyReply) {
    const { id } = TeacherIdParamsSchema.parse(req.params);
    const teacherUpdateParams = PutTeacherSchema.parse(req.body);
    const updatedTeacher = await this._interactor.putTeacher(id, teacherUpdateParams);
    return reply.status(200).send({
      data: this._mapper.toGetTeacherResponse(updatedTeacher),
      message: TeacherMessage.UPDATE_SUCCESS,
    });
  }

  async patchTeacher(req: FastifyRequest, reply: FastifyReply) {
    const { id } = TeacherIdParamsSchema.parse(req.params);
    const teacherUpdateParams = PatchTeacherSchema.parse(req.body);
    const updatedTeacher = await this._interactor.patchTeacher(id, teacherUpdateParams);
    return reply.status(200).send({
      data: this._mapper.toGetTeacherResponse(updatedTeacher),
      message: TeacherMessage.UPDATE_SUCCESS,
    });
  }

  async deleteTeacher(req: FastifyRequest, reply: FastifyReply) {
    const { id } = TeacherIdParamsSchema.parse(req.params);
    await this._interactor.deleteTeacher(id);
    return reply.status(204).send();
  }
}
