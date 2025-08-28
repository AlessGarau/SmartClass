import { FastifyInstance } from "fastify";
import { SensorController } from "./Controller";
import Container from "typedi";
import { zodToJsonSchema } from "zod-to-json-schema";
import { DailySensorDataParamsSchema, DailySensorDataResponseSchema } from "./validate";

export class SensorRoutes {
  private controller: SensorController;

  constructor(private server: FastifyInstance) {
    this.controller = Container.get(SensorController);
  }

  public registerRoutes() {
    this.server.get(
      "/sensor/daily/:roomId",
      {
        schema: {
          tags: ["Sensor"],
          summary: "Get today's sensor data for a room",
          description: "Retrieve all sensor data (temperature, humidity, pressure, movement) for a specific room for the current day",
          params: zodToJsonSchema(DailySensorDataParamsSchema),
          response: {
            200: {
              description: "Daily sensor data retrieved successfully",
              ...zodToJsonSchema(DailySensorDataResponseSchema),
            },
            400: {
              description: "Bad request - Invalid room ID format",
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
            404: {
              description: "No sensor data found for the specified room today",
              type: "object",
              properties: {
                data: { type: "array", items: {} },
                message: { type: "string" },
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
      this.controller.getDailySensorData.bind(this.controller),
    );
  }
}
