import { FastifyInstance } from "fastify";
import Container from "typedi";
import zodToJsonSchema from "zod-to-json-schema";
import { ClassController } from "./Controller";
import { ClassesCountSchema, ClassFilterSchema, ClassIdParamsSchema, ClassSchema, GetClassesQuerySchema } from "./validate";

export class ClassRoutes {
  private controller: ClassController;

  constructor(private server: FastifyInstance) {
    this.controller = Container.get(ClassController);
  }

  public registerRoutes() {
    this.server.get(
      "/class",
      {
        schema: {
          tags: ["Class"],
          summary: "Get all classes",
          description: "Retrieve a list of all classes",
          querystring: zodToJsonSchema(GetClassesQuerySchema),
          response: {
            200: {
              description: "List of classes",
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: zodToJsonSchema(ClassSchema),
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
      this.controller.getClasses.bind(this.controller),
    );

    this.server.get(
      "/class/count",
      {
        schema: {
          tags: ["Class"],
          summary: "Get total count of classes",
          description:
            "Retrieve total number of classes matching optional filter",
          querystring: zodToJsonSchema(ClassFilterSchema),
          response: {
            200: {
              description: "Total count",
              type: "object",
              properties: {
                data: zodToJsonSchema(ClassesCountSchema),
              },
            },
          },
        },
      },
      this.controller.getClassesCount.bind(this.controller),
    );

    this.server.get(
      "/class/:id",
      {
        schema: {
          tags: ["Class"],
          summary: "Get class by ID",
          description: "Retrieve a class by its ID",
          params: zodToJsonSchema(ClassIdParamsSchema),
          response: {
            200: {
              description: "Class details",
              type: "object",
              properties: {
                data: zodToJsonSchema(ClassSchema),
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
      this.controller.getClass.bind(this.controller),
    );
  }
}
