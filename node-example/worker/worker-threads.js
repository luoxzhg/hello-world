const { Worker, isMainThread } = require('worker_threads');

if (isMainThread) {
   for (let i = 0; i < 100; i++) {
      const start = performance.now()
      const worker = new Worker(__filename, {
         resourceLimits: {
            maxOldGenerationSizeMb: 100,
            maxYoungGenerationSizeMb: 1
         }
      });
      console.log('used time', performance.now() - start)
      worker.on('error', err => {
         console.log('error')
         console.error(err)
      })
   }
} else {
   const result = []
   // for (let i = 0; i < 100; i++) {
      // const i = new Array(1024 * 1024)
      // const i = Buffer.alloc(1024 * 1024 * 10)

      // result.push(i)
      // console.log(JSON.stringify(process.memoryUsage()));
   // }
   // console.log(result.length)
   // setInterval(() => {
   //    // Keep thread alive
   // }, 1000);
}
