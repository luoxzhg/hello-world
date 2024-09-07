'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const http = require('node:http');

const obs = new PerformanceObserver((items) => {
   items.getEntries().forEach((item) => {
      console.log(item);
   });
});

obs.observe({ entryTypes: ['http', 'net', 'dns'] });

const PORT = 8082;

http.createServer((req, res) => {
   res.end('ok');
}).listen(PORT, () => {
   http.get(`http://localhost:${PORT}`);
});
