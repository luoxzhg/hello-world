import fastifyPlugin from "fastify-plugin";
import fastifyMongo from "@fastify/mongodb"

export default fastifyPlugin(async function dbConnector (fastify, options) {
   fastify.register(fastify)
})
