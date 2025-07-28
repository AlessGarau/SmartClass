import { Service } from "typedi";
import { FastifyReply, FastifyRequest } from "fastify";
import { UserInteractor } from "./Interactor";
import { UserError } from "./../../middleware/error/userError";
import { UserLoginSchema, UserRegisterSchema } from "./validate";
import { UserResponseMapper } from "./Mapper";
import { UserAuth } from "../../../database/schema/user";
import { UserMobileDeviceInteractor } from "../userMobileDevice/Interactor";

@Service()
export class UserController {
  constructor(
    private interactor: UserInteractor,
    private userMobileDeviceInteractor: UserMobileDeviceInteractor,
    private responseMapper: UserResponseMapper,
  ) { }

  async loginUser(req: FastifyRequest, reply: FastifyReply) {
    const { email, password, deviceToken } = UserLoginSchema.parse(req.body);

    const user = await this.interactor.loginUser({ email, password });

    if (!user) {
      throw UserError.loginFailed();
    }

    const token = await reply.jwtSign({ id: user.id, role: user.role });

    const isMobile = req.headers["user-agent"]?.includes("Mobile") ||
      req.headers["x-client-type"] === "mobile" || req.headers["x-platform"] === "mobile";

    if (isMobile && deviceToken) {
      const refreshToken = await reply.jwtSign({ id: user.id, role: user.role }, { expiresIn: "60d" });
      await this.userMobileDeviceInteractor.saveDeviceToken(user.id, deviceToken, refreshToken);
    }

    if (isMobile) {
      return reply.status(201).send({
        data: {
          user: this.responseMapper.toLoginResponse(user),
          token: token,
        },
        message: "Utilisateur connecté avec succès",
      });
    }

    reply.setCookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "strict",
    });

    return reply.status(201).send({
      data: this.responseMapper.toLoginResponse(user),
      message: "Utilisateur connecté avec succès",
    });
  }

  async registerUser(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password, firstName, lastName, role } = UserRegisterSchema.parse(req.body);

      const user = await this.interactor.registerUser({ email, password, firstName, lastName, role });
      if (!user) {
        throw UserError.registerFailed();
      }

      return reply.status(201).send({
        data: this.responseMapper.toResponse(user),
        message: "Utilisateur créé avec succès",
      });
    } catch (error) {
      throw UserError.registerFailed(error as Error);
    }
  }

  async getUserMe(req: FastifyRequest, reply: FastifyReply) {
    const user = await this.interactor.getUserMe(req.user as UserAuth);
    return reply.status(200).send({
      data: this.responseMapper.toResponse(user),
      message: "Utilisateur récupéré avec succès",
    });
  }

  async logoutUser(req: FastifyRequest, reply: FastifyReply) {
    reply.setCookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    });
    return reply.status(200).send({
      message: "Utilisateur déconnecté avec succès",
    });
  }
}
