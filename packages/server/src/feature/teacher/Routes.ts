import { FastifyInstance } from "fastify";
import Container from "typedi";
import zodToJsonSchema from "zod-to-json-schema";
import { TeacherController } from "./Controller";
import { CreateTeacherSchema, GetTeachersQuerySchema, PatchTeacherSchema, PutTeacherSchema, TeacherFilterSchema, TeacherIdParamsSchema, TeacherSchema, TeachersCountSchema } from "./validate";

export class TeacherRoutes {
  private controller: TeacherController;

  constructor(private server: FastifyInstance) {
    this.controller = Container.get(TeacherController);
  }

  public registerRoutes() {
    this.server.post(
      "/teacher",
      {
        schema: {
          tags: ["Teacher"],
          summary: "Create a new teacher",
          description: "Create a new teacher with the specified details",
          body: zodToJsonSchema(CreateTeacherSchema),
          response: {
            201: {
              description: "Teacher created successfully",
              type: "object",
              properties: {
                data: zodToJsonSchema(TeacherSchema),
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
      this.controller.createTeacher.bind(this.controller),
    );

    this.server.get(
      "/teacher",
      {
        schema: {
          tags: ["Teacher"],
          summary: "Get all teachers",
          description: "Retrieve a list of all teachers",
          querystring: zodToJsonSchema(GetTeachersQuerySchema),
          response: {
            200: {
              description: "List of teachers",
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: zodToJsonSchema(TeacherSchema),
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
      this.controller.getTeachers.bind(this.controller),
    );

    this.server.get(
      "/teacher/count",
      {
        schema: {
          tags: ["Teacher"],
          summary: "Get total count of teachers",
          description:
            "Retrieve total number of teachers matching optional filter",
          querystring: zodToJsonSchema(TeacherFilterSchema),
          response: {
            200: {
              description: "Total count",
              type: "object",
              properties: {
                data: zodToJsonSchema(TeachersCountSchema),
              },
            },
          },
        },
      },
      this.controller.getTeachersCount.bind(this.controller),
    );

    this.server.get(
      "/teacher/:id",
      {
        schema: {
          tags: ["Teacher"],
          summary: "Get teacher by ID",
          description: "Retrieve a teacher by its ID",
          params: zodToJsonSchema(TeacherIdParamsSchema),
          response: {
            200: {
              description: "Teacher details",
              type: "object",
              properties: {
                data: zodToJsonSchema(TeacherSchema),
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
      this.controller.getTeacher.bind(this.controller),
    );

    this.server.put(
      "/teacher/:id",
      {
        schema: {
          tags: ["Teacher"],
          summary: "Update entire teacher by ID",
          description: "Update a teacher entirely using its ID",
          params: zodToJsonSchema(TeacherIdParamsSchema),
          body: zodToJsonSchema(PutTeacherSchema),
          response: {
            200: {
              description: "Teacher entirely updated successfully",
              type: "object",
              properties: {
                data: zodToJsonSchema(TeacherSchema),
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
      this.controller.putTeacher.bind(this.controller),
    );

    this.server.patch(
      "/teacher/:id",
      {
        schema: {
          tags: ["Teacher"],
          summary: "Update teacher by ID",
          description: "Update one or more fields of a teacher using its ID",
          params: zodToJsonSchema(TeacherIdParamsSchema),
          body: zodToJsonSchema(PatchTeacherSchema),
          response: {
            200: {
              description: "Teacher updated successfully",
              type: "object",
              properties: {
                data: zodToJsonSchema(TeacherSchema),
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
      this.controller.patchTeacher.bind(this.controller),
    );

    this.server.delete(
      "/teacher/:id",
      {
        schema: {
          tags: ["Teacher"],
          summary: "Delete a teacher by ID",
          description: "Delete a teacher using its ID",
          params: zodToJsonSchema(TeacherIdParamsSchema),
          response: {
            204: {
              description: "Teacher deleted successfully",
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
      this.controller.deleteTeacher.bind(this.controller),
    );
  }
}
