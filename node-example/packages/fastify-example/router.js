/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Object} options
 */
export async function routers(fastify, options) {
   fastify.get('/',async (req, reply) => {
      req.log.info('hello word')
      return { hello: 'world' }
   })
}
