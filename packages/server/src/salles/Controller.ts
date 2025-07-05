import { FastifyReply, FastifyRequest } from "fastify";
import { ISalleInteractor } from "./interface/IInteractor";
import { SalleParams } from "./validate";

export class SalleController {
  private interactor: ISalleInteractor;

  constructor(interactor: ISalleInteractor) {
    this.interactor = interactor;
  }

  async createSalle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const salleParams = req.body as SalleParams;

      const createdSalle = await this.interactor.createSalle(salleParams);
      return reply.status(201).send(createdSalle);
    } catch (error) {
      console.error("Erreur lors de la création de la salle:", error);
      return reply.status(500).send({
        error: "Erreur interne du serveur lors de la création de la salle",
      });
    }
  }
}
