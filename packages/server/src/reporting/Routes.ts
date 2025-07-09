import { FastifyInstance } from "fastify";
import { ReportingController } from "./Controller";
import Container from "typedi";

export class ReportingRoutes {
  private controller: ReportingController;

  constructor(private server: FastifyInstance) {
    this.controller = Container.get(ReportingController);
  }
  public registerRoutes() {
    this.server.get(
      "/reporting/:id",
      this.controller.findAllReportByRoomId.bind(this.controller)
    );
  }
}
