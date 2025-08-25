import type { FastifyInstance } from "fastify";
import Container from "typedi";
import { zodToJsonSchema } from "zod-to-json-schema";
import { PlanningController } from "./Controller";
import {
  WeeklyPlanningQuerySchema,
  WeeklyPlanningResponseSchema,
  ImportLessonResponseSchema,
  PlanningFilterOptionsResponseSchema,
  DeleteLessonParamsSchema,
  DeleteLessonParams,
} from "./validate";

export class PlanningRoutes {
  private controller: PlanningController;

  constructor(private server: FastifyInstance) {
    this.controller = Container.get(PlanningController);
  }

  public registerRoutes() {
    this.server.get(
      "/planning",
      {
        schema: {
          tags: ["Planning"],
          summary: "Get weekly planning",
          description: "Retrieve the planning for a specific date range with optional building and floor filters (Admin only)",
          querystring: zodToJsonSchema(WeeklyPlanningQuerySchema),
          response: {
            200: {
              description: "Weekly planning retrieved successfully",
              ...zodToJsonSchema(WeeklyPlanningResponseSchema),
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
    this.server.post(
      "/planning/excel",
      {
        schema: {
          tags: ["Planning"],
          summary: "Import lessons from Excel template",
          description: "Upload an Excel file to import lessons into the system (Admin only)",
          consumes: ["multipart/form-data"],
          response: {
            200: {
              description: "Lessons imported successfully",
              ...zodToJsonSchema(ImportLessonResponseSchema),
            },
          },
        },
        onRequest: [this.server.admin],
      },
      this.controller.importLessonTemplate.bind(this.controller),
    );
    this.server.get(
      "/planning/filters",
      {
        schema: {
          tags: ["Planning"],
          summary: "Get available filter options",
          description: "Get all available buildings and floors for filtering (Admin only)",
          response: {
            200: {
              description: "Filter options retrieved successfully",
              ...zodToJsonSchema(PlanningFilterOptionsResponseSchema),
            },
          },
        },
        onRequest: [this.server.admin],
      },
      this.controller.getFilterOptions.bind(this.controller),
    );
    this.server.delete<{ Params: DeleteLessonParams }>(
      "/lessons/:lessonId",
      {
        schema: {
          tags: ["Planning"],
          summary: "Delete a lesson",
          description: "Delete a specific lesson and re-optimize planning (Admin only)",
          params: zodToJsonSchema(DeleteLessonParamsSchema),
          response: {
            200: {
              description: "Lesson deleted successfully",
              type: "object",
              properties: {
                message: { type: "string" },
              },
            },
          },
        },
        onRequest: [this.server.admin],
      },
      this.controller.deleteLesson.bind(this.controller),
    );
    this.server.get(
      "/teacher/planning",
      {
        schema: {
          tags: ["Planning - Teacher"],
          summary: "Get weekly planning for teacher",
          description: "Planning accessible aux enseignants",
          querystring: zodToJsonSchema(WeeklyPlanningQuerySchema),
          response: {
            200: {
              description: "Weekly planning retrieved successfully",
              ...zodToJsonSchema(WeeklyPlanningResponseSchema),
            },
          },
        },
        onRequest: [this.server.teacher], // <— IMPORTANT
      },
      this.controller.getWeeklyPlanning.bind(this.controller),
    );
    this.server.get(
      "/teacher/planning/filters",
      {
        schema: {
          tags: ["Planning - Teacher"],
          summary: "Get planning filters for teacher",
          description: "Filtres accessibles aux enseignants",
          response: {
            200: {
              description: "Filter options retrieved successfully",
              ...zodToJsonSchema(PlanningFilterOptionsResponseSchema),
            },
          },
        },
        onRequest: [this.server.teacher], // <— IMPORTANT
      },
      this.controller.getFilterOptions.bind(this.controller),
    );
  }
}