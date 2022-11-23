const { setTimeout } = require('node:timers/promises');
const Bull = require('bull');

const taskQueue = new Bull('test')

taskQueue.process(1, async (job) => {
   await setTimeout(1000 * 60)
   return 'completed'
})


async function main() {
   await taskQueue.add({ name: 'test1' }, { jobId: 'test1' })
   await taskQueue.add({ name: 'test2' }, { jobId: 'test2' })
   await setTimeout(1000)
   const job2 = await taskQueue.getJob('test2')
   if (await job2.takeLock()) {
      if (await job2.isWaiting()) {
         await job2.remove()   // Error: Could not remove job test2
      }
      await job2.releaseLock()
   }
}

main()
