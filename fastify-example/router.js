import { randomUUID } from "crypto"
import { Readable } from "stream"

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Object} options
 */
export async function routers(fastify, options) {
   fastify.register(await import('@fastify/multipart'))
   fastify.addContentTypeParser('application/octet-stream', function (request, payload, done) {
         done(null, payload)
   })

   fastify.get('/', async (req, reply) => {
      req.log.info('hello word')
      return { hello: 'world' }
   })

   fastify.post('/', async (req, reply) => {
      return { message: 'post successed' }
   })

   fastify.put('/', async (req, reply) => {
      return { message: 'put successed' }
   })

   fastify.put('/api/v1/upload', async (req, reply) => {
      return { id: randomUUID(), nextpart: 1, nextsize: Math.ceil(1024 * 1024) }
   })

   fastify.post('/api/v1/upload/:id', async (req, reply) => {
      return { nextpart: 0, nextsize: 0, nextsleep: 0 }
   })

   fastify.put('/api/v1/upload/:id', async (req, reply) => {
      return { fileid: randomUUID() }
   })

   fastify.post('/api/v1/commit/:product', async (req, reply) => {
      return { id: randomUUID() }
   })

   fastify.get('/api/v1/query/:id', async (req, reply) => {
      return { progress: 100, resp: { resultcode: 0, files: [{ id: randomUUID(), size: 1000 }] } }
   })

   fastify.get('/api/v1/download/:id/:fileid', async (req, reply) => {
      reply.header('Content-Type', 'application/octet-stream')
      return reply.send(Readable.from(Buffer.allocUnsafe(1000)))
   })
}
