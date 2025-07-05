import { FastifyReply, FastifyRequest } from "fastify";
import { SalleCreateSchema, SalleSchema } from "./validate";
import { SalleInteractor } from "./Interactor";
import { Service } from "typedi";

@Service()
export class SalleController {
  constructor(private interactor: SalleInteractor) {}

  async createSalle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const SalleCreateParams = SalleCreateSchema.parse(req.body);

      const createdSalle = await this.interactor.createSalle(SalleCreateParams);
      return reply.status(201).send(createdSalle);
    } catch (error) {
      console.error("Erreur lors de la création de la salle:", error);
      return reply.status(500).send({
        error: "Erreur interne du serveur lors de la création de la salle",
      });
    }
  }
}
