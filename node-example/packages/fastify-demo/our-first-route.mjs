export default async function routes(fastify, options) {
   fastify.get('/', (request, reply) => {
      // return reply.send({ hello: 'world' })
      return { hello: 'world' }
   })
}
