import Fastify from "fastify";
import "reflect-metadata";
import { ErrorMiddleware } from "./error/error.handler";
import { RoomRoutes } from "./room/Routes";

const server = Fastify();

server.get("/", async (request, reply) => {
  return "Wesh les bgs";
});

server.setErrorHandler(ErrorMiddleware);

const roomRoutes = new RoomRoutes(server);
roomRoutes.registerRoutes();

const start = async () => {
  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Serveur lancé sur http://localhost:3000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
