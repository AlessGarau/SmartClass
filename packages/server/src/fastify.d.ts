import { UserAuth } from "../database/schema/user";
import { JWT } from "@fastify/jwt";
import { FastifyReply } from "fastify";

declare module "@fastify/jwt" {
    interface FastifyJWT {
      user?: UserAuth;
    }
  }
  
  declare module "fastify" {
    interface FastifyInstance {
      authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
      admin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
      teacher: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
      setQuerystringParser: (parser: (queryString: string) => object) => void;
    }
    
    interface FastifyRequest {
      jwt: JWT;
    }
  }