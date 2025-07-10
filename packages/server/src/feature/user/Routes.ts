import { FastifyInstance } from "fastify";
import { UserController } from "./Controller";
import Container from "typedi";
import { UserMeResponseSchema } from "./validate";
import zodToJsonSchema from "zod-to-json-schema";

export class UserRoutes {
  private controller: UserController;

  constructor(private server: FastifyInstance) {
    this.controller = Container.get(UserController);
  }

  public registerRoutes() {
    this.server.post(
      "/user/login",
      this.controller.loginUser.bind(this.controller),
    );
    this.server.post(
      "/user/register",
      this.controller.registerUser.bind(this.controller),
    );
    this.server.get(
      "/user/me",
      {
        schema: {
          tags: ["User"],
          summary: "Get current user",
          description: "Get current user",
          response: {
            200: {
              description: "Current user",
              type: "object",
              properties: {
                data: zodToJsonSchema(UserMeResponseSchema),
                message: { type: "string" },
              },
            },
          },
        },
        onRequest: [this.server.authenticate],
      },
      this.controller.getUserMe.bind(this.controller),
    );
  }
}
