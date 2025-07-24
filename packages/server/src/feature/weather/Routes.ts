import { FastifyInstance } from "fastify";
import { WeatherController } from "./Controller";
import Container from "typedi";
import { zodToJsonSchema } from "zod-to-json-schema";
import { WeatherWeekResponseSchema } from "./validate";

export class WeatherRoutes {
  private controller: WeatherController;

  constructor(private server: FastifyInstance) {
    this.controller = Container.get(WeatherController);
  }

  public registerRoutes() {
    this.server.get(
      "/weather/week",
      {
        schema: {
          tags: ["Weather"],
          summary: "Get weekly weather forecast",
          description: "Retrieve weather forecast for the next 7 days",
          response: {
            200: {
              description: "Weekly weather forecast",
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: zodToJsonSchema(WeatherWeekResponseSchema.shape.data.element),
                },
                message: { type: "string" },
              },
            },
            500: {
              description: "Internal server error",
              type: "object",
              properties: {
                error: { type: "string" },
                data: { type: "null" },
              },
            },
          },
        },
      },
      this.controller.getWeeklyWeather.bind(this.controller),
    );
  }
} 