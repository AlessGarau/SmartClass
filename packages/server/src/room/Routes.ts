import { FastifyInstance } from "fastify";
import { RoomController } from "./Controller";
import Container from "typedi";
import { zodToJsonSchema } from "zod-to-json-schema";
import { RoomSchema, RoomCreateSchema } from "./validate";

export class RoomRoutes {
  private controller: RoomController;

  constructor(private server: FastifyInstance) {
    this.controller = Container.get(RoomController);
  }

  public registerRoutes() {
    this.server.post(
      "/room",
      {
        schema: {
          tags: ["Room"],
          summary: "Create a new room",
          description: "Create a new room with the specified details",
          body: zodToJsonSchema(RoomCreateSchema),
          response: {
            201: {
              description: "Room created successfully",
              type: "object",
              properties: {
                data: zodToJsonSchema(RoomSchema),
                message: { type: "string" },
              },
            },
            400: {
              description: "Bad request",
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
      this.controller.createRoom.bind(this.controller),
    );
    
    this.server.get(
      "/room",
      {
        schema: {
          tags: ["Room"],
          summary: "Get all rooms",
          description: "Retrieve a list of all rooms",
          response: {
            200: {
              description: "List of rooms",
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: zodToJsonSchema(RoomSchema),
                },
                message: { type: "string" },
              },
            },
          },
        },
      },
      this.controller.getRooms.bind(this.controller),
    );
  }
}
