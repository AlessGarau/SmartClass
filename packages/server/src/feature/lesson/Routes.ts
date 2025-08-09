import type { FastifyInstance } from "fastify";
import Container from "typedi";
import { zodToJsonSchema } from "zod-to-json-schema";
import { LessonController } from "./Controller";
import {
  LessonIdParamsSchema,
  UpdateLessonBodySchema,
  UpdateLessonResponseSchema,
  DeleteLessonResponseSchema,
  type LessonIdParams,
  type UpdateLessonBody,
} from "./validate";

export class LessonRoutes {
  private controller: LessonController;

  constructor(private server: FastifyInstance) {
    this.controller = Container.get(LessonController);
  }

  public registerRoutes() {
    this.server.put<{ Params: LessonIdParams; Body: UpdateLessonBody }>(
      "/lesson/:lessonId",
      {
        schema: {
          tags: ["Lessons"],
          summary: "Update a lesson",
          description: "Update a specific lesson's details (Admin only)",
          params: zodToJsonSchema(LessonIdParamsSchema),
          body: zodToJsonSchema(UpdateLessonBodySchema),
          response: {
            200: {
              description: "Lesson updated successfully",
              ...zodToJsonSchema(UpdateLessonResponseSchema),
            },
          },
        },
        onRequest: [this.server.admin],
      },
      this.controller.updateLesson.bind(this.controller),
    );

    this.server.delete<{ Params: LessonIdParams }>(
      "/lesson/:lessonId",
      {
        schema: {
          tags: ["Lessons"],
          summary: "Delete a lesson",
          description: "Delete a specific lesson (Admin only)",
          params: zodToJsonSchema(LessonIdParamsSchema),
          response: {
            200: {
              description: "Lesson deleted successfully",
              ...zodToJsonSchema(DeleteLessonResponseSchema),
            },
          },
        },
        onRequest: [this.server.admin],
      },
      this.controller.deleteLesson.bind(this.controller),
    );
  }
}