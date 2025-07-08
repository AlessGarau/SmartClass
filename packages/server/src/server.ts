import "reflect-metadata";
import Fastify from "fastify";
import { RoomRoutes } from "./room/Routes";
import { ErrorMiddleware } from "./error/error.handler";

const server = Fastify();

server.get("/", async (request, reply) => {
  return "Wesh les bgs c michou";
});

server.setErrorHandler(ErrorMiddleware);

const roomRoutes = new RoomRoutes(server);
roomRoutes.registerRoutes();

const start = async () => {
  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`Serveur lancé sur http://localhost:3000`);
  } catch (err) {
    server.log.error(err);  
    process.exit(1);
  }
};

start();
