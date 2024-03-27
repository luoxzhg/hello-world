import { fastify } from "fastify";
import { routers } from "./router.js";
const server = fastify({
   connectionTimeout: 30000,
   requestTimeout: 60000,
   forceCloseConnections: true,
   logger: true
})

server.register(routers)

;(async() => {
   try {
      await server.listen({
         host: '0.0.0.0',
         port: 3000
      })
   } catch (error) {
      server.log.error(error)
      process.exit(1)
   }
})()
