import { FastifyInstance } from "fastify";
import { EquipmentController } from "./Controller";
import Container from "typedi";

export class EquipmentRoutes {
  private controller: EquipmentController;

  constructor(private server: FastifyInstance) {
    this.controller = Container.get(EquipmentController);
  }
  
  public registerRoutes() {
    this.server.get(
      "/equipment/:id",
      this.controller.findAllEquipmentByRoomId.bind(this.controller),
    );
  }
}
