import { Service } from "typedi";
import { FastifyReply, FastifyRequest } from "fastify";
import { UserInteractor } from "./Interactor";
import { UserError } from "../error/userError";
import { UserLoginSchema, UserRegisterSchema } from "./validate";
import { UserMapper } from "./UserMapper";

@Service()
export class UserController {
  constructor(private interactor: UserInteractor) {}

  async loginUser(req: FastifyRequest, reply: FastifyReply) {
    const { email, password } = UserLoginSchema.parse(req.body);

    const user = await this.interactor.loginUser(email, password);

    if (!user) {
      throw UserError.loginFailed();
    }
    const token = await reply.jwtSign({ id: user.id });

    reply.setCookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "strict",
    });

    return reply.status(201).send({
      data: {
        user: UserMapper.toLoginResponse(user),
      },
      message: "Utilisateur connecté avec succès",
    });
  }

  async registerUser(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password, first_name, last_name, role } = UserRegisterSchema.parse(req.body);
      

      const user = await this.interactor.registerUser(email, password, first_name, last_name, role);

      if (!user) {
        throw UserError.registerFailed();
      }

      return reply.status(201).send({
        data: UserMapper.toResponse(user),
        message: "Utilisateur créé avec succès",
      });
    } catch (error) {
      throw UserError.registerFailed();
    }
  }
}
