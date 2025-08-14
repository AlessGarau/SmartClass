import { FastifyInstance } from "fastify";
import Container from "typedi";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ReportingController } from "./Controller";
import { CreateReportingSchema, GetReportsQuerySchema, PatchReportingSchema, ReportingByRoomResponseSchema, ReportingFilterSchema, ReportingIdParamsSchema, ReportingSchema, ReportsCountSchema } from "./validate";

export class ReportingRoutes {
  private controller: ReportingController;

  constructor(private _server: FastifyInstance) {
    this.controller = Container.get(ReportingController);
  }
  public registerRoutes() {

    this._server.post(
      "/reporting",
      {
        schema: {
          tags: ["Reporting"],
          summary: "Create a new report",
          description: "Create a new report with the specified details",
          body: zodToJsonSchema(CreateReportingSchema),
          response: {
            201: {
              description: "Report created successfully",
              type: "object",
              properties: {
                data: zodToJsonSchema(ReportingSchema),
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
      this.controller.createReporting.bind(this.controller),
    );

    this._server.get(
      "/reporting",
      {
        schema: {
          tags: ["Reporting"],
          summary: "Get all reports",
          description: "Retrieve a list of all reports matching optional filters",
          querystring: zodToJsonSchema(GetReportsQuerySchema),
          response: {
            200: {
              description: "List of reports",
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: zodToJsonSchema(ReportingSchema),
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
      this.controller.getReports.bind(this.controller),
    );

    this._server.get(
      "/reporting/:id",
      {
        schema: {
          tags: ["Reporting"],
          summary: "Get reports by room ID",
          description: "Retrieve all reports for a specific room",
          params: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid",
                description: "Room ID",
              },
            },
            required: ["id"],
          },
          response: {
            200: {
              description: "List of reports for the room",
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: zodToJsonSchema(ReportingByRoomResponseSchema),
                },
                message: { type: "string" },
              },
            },
            404: {
              description: "Room not found",
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
      this.controller.findAllReportByRoomId.bind(this.controller),
    );

    this._server.get(
      "/reporting/count",
      {
        schema: {
          tags: ["Reporting"],
          summary: "Get total count of reports",
          description:
            "Retrieve total number of reports matching optional filter",
          querystring: zodToJsonSchema(ReportingFilterSchema),
          response: {
            200: {
              description: "Total count",
              type: "object",
              properties: {
                data: zodToJsonSchema(ReportsCountSchema),
              },
            },
          },
        },
      },
      this.controller.getReportsCount.bind(this.controller),
    );

    this._server.patch(
      "/reporting/:id",
      {
        schema: {
          tags: ["Reporting"],
          summary: "Update reporting by ID",
          description: "Update one or more fields of a reporting using its ID",
          params: zodToJsonSchema(ReportingIdParamsSchema),
          body: zodToJsonSchema(PatchReportingSchema),
          response: {
            200: {
              description: "Reporting updated successfully",
              type: "object",
              properties: {
                data: zodToJsonSchema(ReportingSchema),
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
      this.controller.patchReporting.bind(this.controller),
    );
  }
}
