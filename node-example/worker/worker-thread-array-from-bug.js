const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
   const worker = new Worker(__filename);
   worker.on('error', err => {
      console.log('error')
      console.error(err)
   })

   // setTimeout(() => {
   //    const startTime = performance.now()
   //    for (let i = 0; i < 1000000; i++) {
   //       worker.postMessage({
   //          messageType: 'ping',
   //          startTime
   //       })
   //    }
   // })
   process.on('exit', () => console.log('main exit'))
   worker.terminate()
} else {
   let total = 0
   let count = 0
   let max = 0
   let maxTotal = 0
   let maxCount = 0
   console.log(Array.from("\n𝐀"))
   parentPort.on('message', value => {
      const startTime = value.startTime
      const usedTime  = performance.now() - startTime
      count += 1
      total += usedTime
      if (usedTime > 1) {
         maxTotal += usedTime
         maxCount += 1
      }
      // if (usedTime > max) {
      //    max = usedTime
      //    console.log(`max time => ${usedTime}`)
      // }
      if (count % 10000 == 0) {
         console.log(`used time(mean) => ${total/count}ms, \tbig time => ${maxTotal/maxCount}, \tratio:${maxCount}:${count}`)
      }
   })
}
