'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const net = require('node:net');
const obs = new PerformanceObserver((items) => {
   items.getEntries().forEach((item) => {
      console.log(item);
   });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8082;
net.createServer((socket) => {
   socket.destroy();
}).listen(PORT, () => {
   net.connect(PORT);
});
