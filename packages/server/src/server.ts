import "reflect-metadata";
import Fastify from "fastify";
import { SalleRoutes } from "./salles/Routes";

const server = Fastify();

server.get("/", async (request, reply) => {
  return "Wesh les bgs c michou";
});

const salleRoutes = new SalleRoutes(server);
salleRoutes.registerRoutes();

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
