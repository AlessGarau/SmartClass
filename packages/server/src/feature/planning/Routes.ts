import type { FastifyInstance } from "fastify";
import Container from "typedi";
import { zodToJsonSchema } from "zod-to-json-schema";
import { PlanningController } from "./Controller";
import {
  weeklyPlanningParamsSchema,
  weeklyPlanningQuerySchema,
} from "./validate";

export class PlanningRoutes {
  private controller: PlanningController;

  constructor(private server: FastifyInstance) {
    this.controller = Container.get(PlanningController);
  }

  public registerRoutes() {
    this.server.get(
      "/planning/:weekNumber",
      {
        schema: {
          tags: ["Planning"],
          summary: "Get weekly planning",
          description: "Retrieve the planning for a specific week with optional building and floor filters (Admin only)",
          params: zodToJsonSchema(weeklyPlanningParamsSchema),
          querystring: zodToJsonSchema(weeklyPlanningQuerySchema),
          response: {
            200: {
              description: "Weekly planning retrieved successfully",
              type: "object",
              properties: {
                data: {
                  type: "object",
                  properties: {
                    weekNumber: { type: "number" },
                    year: { type: "number" },
                    classrooms: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          name: { type: "string" },
                          capacity: { type: "number" },
                          building: { type: "string" },
                          floor: { type: "number" },
                          plannedClasses: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                id: { type: "string" },
                                subject: { type: "string" },
                                teacher: { type: "string" },
                                startTime: { type: "string" },
                                endTime: { type: "string" },
                                room: { type: "string" },
                                dayOfWeek: {
                                  type: "string",
                                  enum: ["LUN", "MAR", "MER", "JEU", "VEN"],
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                message: { type: "string" },
              },
            },
            400: {
              description: "Bad request - Invalid parameters",
              type: "object",
              properties: {
                error: { type: "string" },
                details: { type: "array" },
              },
            },
            404: {
              description: "Planning not found",
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
        onRequest: [this.server.admin],
      },
      this.controller.getWeeklyPlanning.bind(this.controller),
    );
  }
}