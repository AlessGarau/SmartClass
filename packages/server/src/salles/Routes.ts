import { FastifyInstance } from "fastify";
import { SalleController } from "./Controller";
import { SalleRepository } from "./Repository";
import { SalleInteractor } from "./Interactor";

export class SalleRoutes {
  private controller: SalleController;

  constructor(private server: FastifyInstance) {
    const repository = new SalleRepository();
    const interactor = new SalleInteractor(repository);
    this.controller = new SalleController(interactor);
  }

  public registerRoutes() {
    this.server.post(
      "/salle",
      this.controller.createSalle.bind(this.controller)
    );
  }
}
