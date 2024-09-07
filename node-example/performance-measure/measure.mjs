import { PerformanceObserver, performance } from "node:perf_hooks";

const perfObs = new PerformanceObserver((entries => {
   console.log(entries.getEntries())
   performance.clearMarks()
}))

perfObs.observe({ type: 'measure'})

performance.mark('A')
setTimeout(() => {
   performance.measure('A to now', 'A')
   queueMicrotask(() => {
      performance.mark('B')
      performance.measure('A to B', 'A', 'B')
   })
}, 1000)
