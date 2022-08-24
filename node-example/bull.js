const Bull = require('bull');

const queue = new Bull('test')

queue.add({
   fileContent: Buffer.from('abcdefg')
})

queue.process(async (job) => {
   console.log(job.data)
})