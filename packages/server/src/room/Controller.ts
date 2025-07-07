import { FastifyReply, FastifyRequest } from "fastify";
import { SalleInteractor } from "./Interactor";
import { Service } from "typedi";
import { SalleCreateSchema } from "@monorepo/common";

@Service()
export class SalleController {
  constructor(private interactor: SalleInteractor) {}

  async createSalle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const salleCreateParams = SalleCreateSchema.parse(req.body);

      const createdSalle = await this.interactor.createSalle(salleCreateParams);

      return reply.status(201).send({
        data: createdSalle,
        message: "Salle créée avec succès",
      });
    } catch (error) {
      throw error;
    }
  }
}
