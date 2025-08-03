import { type FastifyInstance } from "fastify";
import { UserController } from "./Controller";
import Container from "typedi";
import { UserMeResponseSchema, UserRegisterSchema } from "./validate";
import zodToJsonSchema from "zod-to-json-schema";

export class UserRoutes {
  private controller: UserController;

  constructor(private server: FastifyInstance) {
    this.controller = Container.get(UserController);
  }

  public registerRoutes() {
    this.server.post(
      "/user/login",
      {
        schema: {
          tags: ["User"],
          summary: "User login",
          description: "Authenticate user and return user data with token",
          body: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email: { type: "string", format: "email" },
              password: { type: "string", minLength: 6 },
            },
          },
          response: {
            200: {
              description: "User successfully logged in",
              type: "object",
              properties: {
                data: zodToJsonSchema(UserMeResponseSchema),
                token: { type: "string", description: "JWT access token" },
                message: { type: "string" },
              },
              required: ["data", "token", "message"],
            },
          },
        },
      },
      this.controller.loginUser.bind(this.controller),
    );
    this.server.post(
      "/user/register",
      {
        schema: {
          tags: ["User"],
          summary: "Register a new user",
          description: "Create a new user account",
          body: {
            type: "object",
            required: ["email", "password", "firstName", "lastName"],
            ...zodToJsonSchema(UserRegisterSchema),
          },
          response: {
            201: {
              description: "User registered successfully",
              type: "object",
              properties: {
                data: zodToJsonSchema(UserMeResponseSchema),
                token: { type: "string", description: "JWT access token" },
                message: { type: "string" },
              },
              required: ["data", "token", "message"],
            },
          },
        },
      },
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
    this.server.post(
      "/user/logout",
      {
        schema: {
          tags: ["User"],
          summary: "Logout user",
          description: "Logout user",
          response: {
            200: {
              description: "User logged out",
              type: "object",
              properties: {
                message: { type: "string" },
              },
            },
          },
        },
      },
      this.controller.logoutUser.bind(this.controller),
    );
  }
}
