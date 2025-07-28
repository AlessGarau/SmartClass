import type { FastifyInstance } from "fastify";
import Container from "typedi";
import { zodToJsonSchema } from "zod-to-json-schema";
import { PlanningController } from "./Controller";
import {
  WeeklyPlanningParamsSchema,
  WeeklyPlanningQuerySchema,
  WeekPlanningResultSchema,
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
          params: zodToJsonSchema(WeeklyPlanningParamsSchema),
          querystring: zodToJsonSchema(WeeklyPlanningQuerySchema),
          response: {
            200: {
              description: "Weekly planning retrieved successfully",
              type: "object",
              properties: {
                data: zodToJsonSchema(WeekPlanningResultSchema),
                message: { type: "string" },
              },
            },
          },
        },
        onRequest: [this.server.admin],
      },
      this.controller.getWeeklyPlanning.bind(this.controller),
    );
    this.server.get(
      "/planning/excel",
      {
        schema: {
          tags: ["Planning"],
          summary: "Download lesson import template",
          description: "Download a CSV template file for importing lessons (Admin only)",
          response: {
            200: {
              description: "Template file downloaded successfully",
              type: "string",
              format: "binary",
            },
          },
        },
        onRequest: [this.server.admin],
      },
      this.controller.downloadLessonTemplate.bind(this.controller),
    );
  }
}