import { FastifyRequest, FastifyReply } from "fastify";
import { UserError } from "../error/userError";
import { UserAuth } from "../../database/schema/user";

export const authMiddleware = async (request: FastifyRequest, _reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    throw UserError.unauthorizedAccess(err as Error);
  }
};

export const adminMiddleware = async (request: FastifyRequest, _reply: FastifyReply) => {
  await authMiddleware(request, _reply);

  if ((request.user as UserAuth)?.role !== "admin") {
    throw UserError.unauthorizedAccess();
  }
};

export const teacherMiddleware = async (request: FastifyRequest, _reply: FastifyReply) => {
  await authMiddleware(request, _reply);

  if ((request.user as UserAuth)?.role !== "teacher") {
    throw UserError.unauthorizedAccess();
  }
};