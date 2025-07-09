import { FastifyInstance } from "fastify";
import { RoomController } from "./Controller";
import Container from "typedi";

export class RoomRoutes {
  private controller: RoomController;

  constructor(private server: FastifyInstance) {
    this.controller = Container.get(RoomController);
  }

  public registerRoutes() {
    this.server.post(
      "/room",
      this.controller.createRoom.bind(this.controller),
    );
    this.server.get(
      "/room",
      this.controller.getRooms.bind(this.controller),
    );
  }
}
