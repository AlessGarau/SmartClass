import "reflect-metadata";
import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { ErrorMiddleware } from "./middleware/error/error.handler";
import { RoomRoutes } from "./feature/room/Routes";
import { ReportingRoutes } from "./feature/reporting/Routes";
import { EquipmentRoutes } from "./feature/equipment/Routes";

const setupServer = async () => {
  const server = Fastify();

  // Register OpenAPI/Swagger plugins
  await server.register(fastifySwagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "SmartClass API",
        description: "API for SmartClass application",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Development server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  await server.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => {
      return swaggerObject;
    },
  });

  server.get("/", async (_request, _reply) => {
    return "Wesh les bgs";
  });

  server.setErrorHandler(ErrorMiddleware);

  const roomRoutes = new RoomRoutes(server);
  roomRoutes.registerRoutes();
  const reportingRoutes = new ReportingRoutes(server);
  reportingRoutes.registerRoutes();
  const equipmentRoutes = new EquipmentRoutes(server);
  equipmentRoutes.registerRoutes();

  return server;
};

const start = async () => {
  try {
    const server = await setupServer();
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Serveur lancé sur http://localhost:3000");
    console.log("API Documentation disponible sur http://localhost:3000/docs");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
