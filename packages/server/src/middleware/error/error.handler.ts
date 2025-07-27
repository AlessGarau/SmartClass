import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";
import NotFoundError from "./notFoundError";
import { RoomError } from "./roomError";
import { UserError } from "./userError";
import { WeatherError } from "./weatherError";
import { MqttError } from "./mqttError";
import { PlanningError } from "./planningError";

export const ErrorMiddleware = (
  error:
    | FastifyError
    | NotFoundError
    | RoomError
    | UserError
    | WeatherError
    | MqttError
    | PlanningError
    | z.ZodError,
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

  if (error instanceof WeatherError) {
    return reply.status(error.statusCode).send({
      error: error.message,
      data: null,
    });
  }

  if (error instanceof MqttError) {
    return reply.status(error.statusCode).send({
      error: error.message,
      data: error.cause,
    });
  }

  if (error instanceof PlanningError) {
    return reply.status(error.statusCode).send({
      error: error.message,
      data: null,
    });
  }

  if ("statusCode" in error) {
    return reply.status(error.statusCode || 500).send({
      error: error.message || "Internal server error",
      data: null,
    });
  }

  return reply.status(500).send({
    error: "Internal server error",
    data: null,
  });
};
