import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";
import NotFoundError from "./notFoundError";
import { RoomError } from "./roomError";
import { UserError } from "./userError";

export const ErrorMiddleware = (
  error: FastifyError | NotFoundError | RoomError | z.ZodError | UserError,
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  console.error(error);

  if (error instanceof NotFoundError) {
    return reply.status(404).send({
      error: error.message,
      data: null,
    });
  }

  if (error instanceof RoomError) {
    return reply.status(error.statusCode).send({
      error: error.message,
      data: null,
    });
  }

  if (error instanceof z.ZodError) {
    return reply.status(400).send({
      error: "Validation error",
      details: error.errors,
      data: null,
    });
  }

  if (error instanceof UserError) {
    return reply.status(error.statusCode).send({
      error: error.message,
      data: error.cause,
    });
  }

  if ("statusCode" in error) {
    return reply.status(error.statusCode || 500).send({
      error: error.message || "Erreur interne du serveur",
      data: null,
    });
  }

  return reply.status(500).send({
    error: "Erreur interne du serveur",
    data: null,
  });
};
