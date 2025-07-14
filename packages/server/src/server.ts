import "reflect-metadata";
import Fastify from "fastify";
import dotenv from "dotenv";
import fjwt from "@fastify/jwt";
import fCookie from "@fastify/cookie";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import { ErrorMiddleware } from "./middleware/error/error.handler";
import { RoomRoutes } from "./feature/room/Routes";
import { ReportingRoutes } from "./feature/reporting/Routes";
import { EquipmentRoutes } from "./feature/equipment/Routes";
import { UserRoutes } from "./feature/user/Routes";
import { WeatherRoutes } from "./feature/weather/Routes";
import { adminMiddleware, authMiddleware, teacherMiddleware } from "./middleware/auth.middleware";
import Container from "typedi";
import { SensorDataCollector } from "./services/SensorDataCollector";

dotenv.config();

const setupServer = async () => {
  const server = Fastify();

  await server.register(fastifyCors, {
    origin: [
      "http://localhost:5173",
      "http://smart-class-client-dev:5173",
    ],
    credentials: true,
  });

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

  server.register(fjwt, {
    secret: process.env.JWT_SECRET!,
    cookie: {
      cookieName: "token",
      signed: false,
    },
  });

  server.addHook("preHandler", (req, _res, next) => {
    req.jwt = server.jwt;
    return next();
  });

  server.decorate("authenticate", authMiddleware);
  server.decorate("admin", adminMiddleware);
  server.decorate("teacher", teacherMiddleware);

  server.register(fCookie, {
    secret: process.env.COOKIE_SECRET!,
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
  const userRoutes = new UserRoutes(server);
  userRoutes.registerRoutes();
  const weatherRoutes = new WeatherRoutes(server);
  weatherRoutes.registerRoutes();

  return server;
};

const start = async () => {
  try {
    const server = await setupServer();
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Serveur lancé sur http://localhost:3000");
    console.log("API Documentation disponible sur http://localhost:3000/docs");
    
    const mqttBrokerUrl = process.env.MQTT_BROKER_URL || "mqtt://admin-hetic.arcplex.tech:8823";
    const sensorDataCollector = Container.get(SensorDataCollector);
    
    try {
      await sensorDataCollector.start(mqttBrokerUrl);
      console.log("Service de collecte de données MQTT démarré");
    } catch (mqttError) {
      console.error("Erreur lors du démarrage du service MQTT:", mqttError);
      console.log("Le serveur continue sans le service MQTT");
    }
    
    process.on("SIGINT", () => {
      console.log("Arrêt du serveur...");
      sensorDataCollector.stop();
      process.exit(0);
    });
    
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
