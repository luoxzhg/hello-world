const { Queue, Worker } = require('bullmq');

const queue = new Queue('test')

queue.add('abc', {
   fileContent: Buffer.from('abcdefg')
})

const worker = new Worker('test', async (job) => {
   console.log(job)
})