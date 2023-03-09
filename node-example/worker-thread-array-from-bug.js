const { Worker, isMainThread } = require('worker_threads');

if (isMainThread) {
   const worker = new Worker(__filename);
   worker.on('error', err => {
      console.log('error')
      console.error(err)
   })
} else {
   console.log(Array.from("\n𝐀"))
}
