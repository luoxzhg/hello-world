import Fastify from "fastify";
// import dbConnector from "./our-db-connector.mjs";
import firstRoute from "./our-first-route.mjs";

const fastify = Fastify({ logger: true });
fastify.after(() => console.log('init fastify instance'));
// fastify.register(dbConnector);
fastify.register(firstRoute);
fastify.after(() => console.log('register firstRoute'));

fastify.ready(() => console.log('ready'));

fastify.listen({ port: 3000 }).catch((err) => {
   fastify.log.error(err)
   process.exit(1)
});
