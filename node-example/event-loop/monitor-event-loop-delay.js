const { monitorEventLoopDelay } = require('perf_hooks');

// 启动对事件循环延迟的监控
const h = monitorEventLoopDelay({ resolution: 20 }); // 分辨率为 20ms
h.enable();

setInterval(() => {
   console.log(`Event Loop Delay Mean: ${h.mean.toFixed(2)}ms`);
   console.log(`Event Loop Delay Max: ${h.max.toFixed(2)}ms`);
   console.log(`Event Loop Delay Min: ${h.min.toFixed(2)}ms`);
}, 1000);
