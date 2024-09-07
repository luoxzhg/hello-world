'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const dns = require('node:dns');
const obs = new PerformanceObserver((items) => {
   items.getEntries().forEach((item) => {
      console.log(item);
   });
});
obs.observe({ entryTypes: ['dns'] });
dns.lookup('localhost', () => { });
dns.promises.resolve('localhost');
