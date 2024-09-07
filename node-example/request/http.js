const http = require('node:http');
const { Readable } = require('node:stream');

const req = http.request('http://127.0.0.1:3000/',{
   method: 'GET'
}, (res) => {
   console.log('on response event')
   console.log(res.constructor.name)
   res.on('readable', () => {
      console.log(res.read())
   })
})

// Readable.from(Buffer.from(JSON.stringify({a: 10}))).pipe(req)
// req.write()
// req.end()

req.on('socket', (socket) => {
   console.log('on request.socket event')
   socket.on('close', () => console.log('on socket.close event'))
   socket.on('connect', () => console.log('on socket.connect event'))
   socket.on('data', () => console.log('on socket.data event'))
   // socket.on('readable', () => console.log('on socket.readable event'))
   socket.on('drain', () => console.log('on socket.drain event'))
   socket.on('finish', ()=> console.log('on socket.finish event'))
   socket.on('end', () => console.log('on socket.end event'))
   socket.on('error', () => console.log('on socket.error event'))
   socket.on('lookup', () => console.log('on socket.lookup event'))
   // socket.on('ready', () => console.log('on socket.ready event'))
   socket.on('timeout', () => console.log('on socket.timeout event'))
   socket.on('connectionAttempt', () => console.log('on socket.connectionAttempt event'))

   socket.on('ready', () => {
      console.log('on socket.ready event')
      // req.write(Buffer.from(JSON.stringify({a: 10})))
      req.end()
      // socket.end()
   })
})

req.on('prefinish', () => console.log('on request.prefinish event'))
req.on('finish', () => console.log('on request.finish event'))
req.on('drain', () => console.log('on request.drain event'))
req.on('abort', () => console.log('on request.abort event'))
req.on('close', () => console.log('on request.close event'))
req.on('connect', (req, socket, head) => console.log('on request.connect event'))
req.on('continue', () => console.log('on request.continue event'))
req.on('error', () => console.log('on request.error event'))
req.on('response', () => console.log('on request.response event'))
req.on('timeout', () => console.log('on request.timeout event'))
req.on('pipe', () => console.log('on request.pipe event'))
