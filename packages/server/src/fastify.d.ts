import { FastifyJWT } from '@fastify/jwt'

declare module 'fastify' {
  interface FastifyRequest {
    jwt: FastifyJWT
  }
  interface FastifyInstance {
    authenticate: any
  }
}