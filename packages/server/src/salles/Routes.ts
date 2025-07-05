import { FastifyInstance } from "fastify";
import { SalleController } from "./Controller";
import { SalleRepository } from "./Repository";
import { SalleInteractor } from "./Interactor";
import Container from "typedi";

export class SalleRoutes {
  private controller: SalleController;

  constructor(private server: FastifyInstance) {
    this.controller = Container.get(SalleController);
  }

  public registerRoutes() {
    this.server.post(
      "/salle",
      this.controller.createSalle.bind(this.controller)
    );
  }
}
