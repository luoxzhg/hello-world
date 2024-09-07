// Create a performance observer
const obs = new PerformanceObserver(list => {
   console.error(list.getEntries())
});

// Subscribe to notifications of GCs
obs.observe({ entryTypes: ['gc'] });

// script.mjs

import os from 'node:os';

let len = 1_000_000;
const entries = new Set();

function addEntry() {
   const entry = {
      timestamp: Date.now(),
      memory: os.freemem(),
      totalMemory: os.totalmem(),
      uptime: os.uptime(),
   };

   entries.add(entry);
}

function summary() {
   console.log(`Total: ${entries.size} entries`);
}

// execution
(() => {
   while (len > 0) {
      setImmediate(addEntry);
      process.stdout.write(`~~> ${len} entries to record\r`);
      len--;
   }

   summary();
})();

// Stop subscription
// obs.disconnect();
