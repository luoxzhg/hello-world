const http = require('node:http');
const { setTimeout } = require('node:timers/promises');
const Axios = require('axios').default;
const FromData = require('form-data');
const { Readable } = require('node:stream');

const axios = Axios.create({
   // baseURL: 'http://host.docker.internal:3000'
   baseURL: 'http://192.168.6.137:3000',
   // httpAgent: new http.Agent({ keepAlive: true, keepAliveMsecs: 30000, maxSockets:256, maxFreeSockets: 32 }),
   // timeout: 1000
});

axios.interceptors.request.use(config => {
   config.headers['Date'] = performance.now().toString()

   return config
})

axios.interceptors.response.use(resp => resp, error => {
   const config = error.config
   const startTime = Number(config.headers['Date'])
   console.log(`error time ${performance.now() - startTime}`)
   return Promise.reject(error)
});

(async () => {
   let n = 1
   let startTime = performance.now()
   while (n) {
      test()
      await setTimeout(200)
      // const endTime = performance.now()
      // console.log(`test count: ${n++}, usedtime: ${endTime - startTime}ms`)
      // await setTimeout(1000)
   }
})()

async function test() {
   const requests = []
   for (let index = 0; index < 1; index++) {
      requests.push(send_request())
   }

   const results = await Promise.allSettled(requests)
   results.forEach(result => {
      if (result.status == 'rejected') {
         console.log('rejected error', result.reason)
      }
   })
}

const buf = Buffer.allocUnsafe(1024 * 500)

async function send_request() {
   // await setTimeout(Math.random() * 1000 * 10)
   const startTime = performance.now()
   await axios.put('/', { data: 'post' })
   const putTime = performance.now()
   console.log(`put time ${putTime - startTime}`)

   const form = new FromData({ maxDataSize: Infinity })
   form.append('file', Readable.from(buf))

   await axios.post('/', form, {
      headers: form.getHeaders()
   })
   const postTime = performance.now()
   console.log(`post time ${postTime - putTime}`)
   await axios.post('/', { data: 'post' })
   const postTime2 = performance.now()
   console.log(`post time2 ${postTime2 - postTime}`)
   await axios.get('/')
   const getTime = performance.now()
   console.log(`get time ${getTime - postTime2}`)
}
