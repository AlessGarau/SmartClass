import { FastifyInstance } from "fastify";
import Container from "typedi";
import { zodToJsonSchema } from "zod-to-json-schema";
import { RoomController } from "./Controller";
import {
  CreateRoomSchema,
  GetRoomFilterOptionsSchema,
  GetRoomsQuerySchema,
  PatchRoomSchema,
  PutRoomSchema,
  RoomCountSchema,
  RoomFilterOptionsSchema,
  RoomFilterSchema,
  RoomIdParamsSchema,
  RoomSchema,
  RoomWithMetricsSchema,
} from "./validate";

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
            409: {
              description: "Already Exists",
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
            500: {
              description: "Internal server error",
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
                  items: zodToJsonSchema(RoomWithMetricsSchema),
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
            500: {
              description: "Internal server error",
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
      "/room/filters",
      {
        schema: {
          tags: ["Room"],
          summary: "Get available filter options",
          description: "Get all available buildings and floors for filtering (Admin only)",
          querystring: zodToJsonSchema(GetRoomFilterOptionsSchema),
          response: {
            200: {
              description: "Filter options retrieved successfully",
              type: "object",
              properties: {
                data: zodToJsonSchema(RoomFilterOptionsSchema),
              },
            },
          },
        },
        onRequest: [this.server.admin],
      },
      this.controller.getRoomFilterOptions.bind(this.controller),
    );

    this.server.get(
      "/room/count",
      {
        schema: {
          tags: ["Room"],
          summary: "Get total count of rooms",
          description:
            "Retrieve total number of rooms matching optional filter",
          querystring: zodToJsonSchema(RoomFilterSchema),
          response: {
            200: {
              description: "Total count",
              type: "object",
              properties: {
                data: zodToJsonSchema(RoomCountSchema),
              },
            },
          },
        },
      },
      this.controller.getRoomsCount.bind(this.controller),
    );

    this.server.get(
      "/room/:id",
      {
        schema: {
          tags: ["Room"],
          summary: "Get room by ID",
          description: "Retrieve a room by its ID",
          params: zodToJsonSchema(RoomIdParamsSchema),
          response: {
            200: {
              description: "Room details",
              type: "object",
              properties: {
                data: zodToJsonSchema(RoomWithMetricsSchema),
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
            500: {
              description: "Internal server error",
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

    this.server.put(
      "/room/:id",
      {
        schema: {
          tags: ["Room"],
          summary: "Update entire room by ID",
          description: "Update a room entirely using its ID",
          params: zodToJsonSchema(RoomIdParamsSchema),
          body: zodToJsonSchema(PutRoomSchema),
          response: {
            200: {
              description: "Room entirely updated successfully",
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
            404: {
              description: "Room not found",
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
            409: {
              description: "Conflict",
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
            500: {
              description: "Internal server error",
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
      this.controller.putRoom.bind(this.controller),
    );

    this.server.patch(
      "/room/:id",
      {
        schema: {
          tags: ["Room"],
          summary: "Update room by ID",
          description: "Update one or more fields of a room using its ID",
          params: zodToJsonSchema(RoomIdParamsSchema),
          body: zodToJsonSchema(PatchRoomSchema),
          response: {
            200: {
              description: "Room updated successfully",
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
            404: {
              description: "Room not found",
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
            409: {
              description: "Conflict",
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
            500: {
              description: "Internal server error",
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
      this.controller.patchRoom.bind(this.controller),
    );

    this.server.delete(
      "/room/:id",
      {
        schema: {
          tags: ["Room"],
          summary: "Delete a room by ID",
          description: "Delete a room using its ID",
          params: zodToJsonSchema(RoomIdParamsSchema),
          response: {
            204: {
              description: "Room deleted successfully",
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
            500: {
              description: "Internal server error",
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
      this.controller.deleteRoom.bind(this.controller),
    );
  }
}
