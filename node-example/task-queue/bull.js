const Bull = require('bull');
const { setTimeout } = require('node:timers/promises');

const queue = new Bull('test')

// queue.add({
//    fileContent: Buffer.from('abcdefg')
// })

queue.process(async (job) => {
// module.exports = async (job) => {
   const delta = Date.now() - job.data.startAt
   console.log(`process task ${job.data.id}, started after ${delta}ms`)

   await setTimeout(1000 *2)
   return 'other process'
})
