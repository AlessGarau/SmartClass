import { FastifyReply, FastifyRequest } from "fastify";
import { Service } from "typedi";
import { ClassInteractor } from "./Interactor";
import { ClassMapper } from "./Mapper";
import { GetClassesQuerySchema } from "./validate";

@Service()
export class ClassController {
  constructor(
    private _interactor: ClassInteractor,
    private _mapper: ClassMapper,
  ) { }

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

}
