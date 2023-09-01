import { fastify } from "fastify";
import { routers } from "./router.js";
const server = fastify({
   logger: true
})

server.register(routers)

;(async() => {
   try {
      await server.listen({
         port: 3000
      })
   } catch (error) {
      server.log.error(err)
      process.exit(1)
   }
})()
