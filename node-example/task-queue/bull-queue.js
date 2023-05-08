'use strict'

const path = require('node:path');
const { setTimeout } = require('node:timers/promises');
const Bull = require('bull');

const queue = new Bull('test')
// const resultQ = new Bull('result')

queue.on('global:completed', async (jobId, result) => {
   const job = await queue.getJob(jobId)
   const delta = Date.now() - job.data.startAt
   console.log(`job ${job.data.id} completed time: ${delta.toFixed(0)}ms`)
   console.log(`remove ${job.data.id}`)
   if (tasks.has(job.data.id)) {
         console.log(`job is responsed with ${result}`)
         tasks.delete('abc')
      await job.remove()
   }
})

queue.on('global:failed', (jobId, error) => {
   console.log('failed job', jobId)
   console.log(error)
})

// queue.process(job => {
//    const delta = Date.now() - job.data.startAt
//    if (delta > job.opts.timeout) {
//       return {code: 50001, message: '服务器繁忙，请稍后重试'}
//    }
//    job.retry()
// })

// queue.process(1, path.join(__dirname, './bull.js'))

const tasks = new Map();



; (async () => {
   try {
      for (let i = 0; i < 10; i++) {
         const id = `id-${i}`
         tasks.set(id, 'res')
         queue.add({
            id,
            startAt: Date.now()
         }, {
            timeout: 3000,
            removeOnComplete: 10,
            removeOnFail: 10
         })
            .then((job) => {
               setTimeout(3000).then(async () => {
                  await job.takeLock()
                  const state = await job.getState()
                  console.log(`${id} ${state}`)
                  if (state === 'waiting') {
                     console.log(`job ${id} waiting too long`)
                     job.remove()
                  }
                  await job.releaseLock()
               })
            })
      }
   } catch (error) {
      console.log(error)
   }

   // console.log(`job is completed with ${job.returnvalue}`)
})()
