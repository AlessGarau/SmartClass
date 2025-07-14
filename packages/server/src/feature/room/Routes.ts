import { FastifyInstance } from "fastify";
import { RoomController } from "./Controller";
import Container from "typedi";
import { zodToJsonSchema } from "zod-to-json-schema";
import { RoomSchema, CreateRoomSchema, GetRoomsQuerySchema, GetRoomParamsSchema } from "./validate";

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
          body: zodToJsonSchema(CreateRoomSchema),
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
          querystring: zodToJsonSchema(GetRoomsQuerySchema),
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
      this.controller.getRooms.bind(this.controller),
    );

    this.server.get(
      "/room/:id",
      {
        schema: {
          tags: ["Room"],
          summary: "Get room by ID",
          description: "Retrieve a room by its ID",
          params: zodToJsonSchema(GetRoomParamsSchema),
          response: {
            200: {
              description: "Room details",
              type: "object",
              properties: {
                data: zodToJsonSchema(RoomSchema),
              },
            },
            400: {
              description: "Bad request",
              type: "object",
              properties: {
                error: { type: "string" },
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
      this.controller.getRoom.bind(this.controller),
    );
  }
}
