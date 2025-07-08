import { FastifyInstance } from "fastify";
import { UserController } from "./Controller";
import Container from "typedi";

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
    // this.server.get(
    //   "/user/me",
    //   this.controller.getUserMe.bind(this.controller)
    // );
  }
}
