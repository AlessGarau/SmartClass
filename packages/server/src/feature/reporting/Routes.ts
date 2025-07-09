import { FastifyInstance } from "fastify";
import { ReportingController } from "./Controller";
import Container from "typedi";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ReportingByRoomResponseSchema } from "./validate";

export class ReportingRoutes {
  private controller: ReportingController;

  constructor(private _server: FastifyInstance) {
    this.controller = Container.get(ReportingController);
  }
  public registerRoutes() {
    this._server.get(
      "/reporting/:id",
      {
        schema: {
          tags: ["Reporting"],
          summary: "Get reports by room ID",
          description: "Retrieve all reports for a specific room",
          params: {
            type: "object",
            properties: {
              id: { 
                type: "string", 
                format: "uuid",
                description: "Room ID", 
              },
            },
            required: ["id"],
          },
          response: {
            200: {
              description: "List of reports for the room",
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: zodToJsonSchema(ReportingByRoomResponseSchema),
                },
                message: { type: "string" },
              },
            },
            404: {
              description: "Room not found",
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
      this.controller.findAllReportByRoomId.bind(this.controller),
    );
  }
}
