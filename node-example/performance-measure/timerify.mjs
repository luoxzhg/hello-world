import { performance, PerformanceObserver } from 'node:perf_hooks';

function someFunction() {
   console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
   console.log(list.getEntries()[0].duration);

   performance.clearMarks();
   performance.clearMeasures();
   obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// A performance timeline entry will be created
wrapped();
setTimeout(() => wrapped())
