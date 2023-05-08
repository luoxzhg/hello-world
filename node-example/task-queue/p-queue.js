const Queue  = require('p-queue').default
const { setTimeout } = require('timers/promises')

const queue = new Queue({
   // concurrency: 1
   concurrency: 2
})

function genTask(n) {
   return async() => {
      console.log(`async task ${n} start`)
      await setTimeout(2 * 1000)
      console.log(`async task ${n} end`)
      return true
   }
}

(async() => {
   queue.add(genTask(1))
   queue.add(genTask(2))
   const task = await queue.add(genTask(3))
   console.log(task)
})()
