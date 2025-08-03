import { FastifyInstance } from "fastify";
import Container from "typedi";
import zodToJsonSchema from "zod-to-json-schema";
import { ClassController } from "./Controller";
import { ClassSchema, GetClassesQuerySchema } from "./validate";

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
  }
}
