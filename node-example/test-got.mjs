
import { Readable } from 'node:stream';
import FromData from 'form-data';
import got, { Options } from "got";

const options = new Options({
   // prefixUrl: 'http://host.docker.internal:3000'
   prefixUrl: 'http://192.168.6.137:3000',
   timeout: { request: 30000, response: 30000}
});

const client = got.extend(options);

(async() => {
   let n = 1
   let startTime = performance.now()
   while (n) {
      await test()
      // const endTime = performance.now()
      // console.log(`test count: ${n++}, usedtime: ${endTime - startTime}ms`)
      // await setTimeout(1000)
   }
})()

async function test() {
   const requests = []
   // for (let index = 0; index < 100; index++) {
      requests.push(send_request())
   // }

   const results = await Promise.allSettled(requests)
   results.forEach(result => {
      if (result.status == 'rejected') {
         console.log('rejected error', result.reason)
      }
   })
}

const buf = Buffer.allocUnsafe(1024*500)

async function send_request() {
   // await setTimeout(Math.random() * 1000 * 10)
   const startTime = performance.now()
   await client.put('', { json: { data: 'post' } }).json();

   const putTime = performance.now()
   console.log(`put time ${ putTime - startTime}`)

   // const form = new FromData({ maxDataSize: Infinity })
   // form.append('file', Readable.from(buf))
   await client.post('', { body: Readable.from(buf), headers: { 'content-type': 'application/octet-stream'} }).json();

   const postTime = performance.now()
   console.log(`post time ${postTime - putTime}`)

   await client.post('', { json: { data: 'post' } }).json();

   const postTime2 = performance.now()
   console.log(`post time2 ${postTime2 - postTime}`)

   await client.get('').json();

   const getTime = performance.now()
   console.log(`get time ${getTime - postTime2}`)
}
