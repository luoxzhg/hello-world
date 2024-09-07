'use strict'

import { createWriteStream } from "fs";

const file = createWriteStream('timing.log')

function doTiming() {
   const start = performance.now()
   setImmediate(() => {
      const end = performance.now()
      const duration = end - start
      if (duration < 1) {
         return
      }
      file.write(`${(end -start).toFixed(3)}ms\n`)
   })
   setTimeout(doTiming)
}


doTiming()


process.on('beforeExit', () => {
   file.end()
})
