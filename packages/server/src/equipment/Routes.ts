import { FastifyInstance } from "fastify";
import { EquipmentController } from "./Controller";
import Container from "typedi";
import { zodToJsonSchema } from "zod-to-json-schema";
import { EquipmentByRoomResponseSchema } from "./validate";

export class EquipmentRoutes {
  private controller: EquipmentController;

  constructor(private server: FastifyInstance) {
    this.controller = Container.get(EquipmentController);
  }
  
  public registerRoutes() {
    this.server.get(
      "/equipment/:id",
      {
        schema: {
          tags: ["Equipment"],
          summary: "Get equipment by room ID",
          description: "Retrieve all equipment for a specific room",
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
              description: "List of equipment for the room",
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: zodToJsonSchema(EquipmentByRoomResponseSchema),
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
      this.controller.findAllEquipmentByRoomId.bind(this.controller),
    );
  }
}
