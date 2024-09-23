const { performance } = require('perf_hooks');

// 定义监控函数
function monitorEventLoopLag(interval = 1000) {
   let lastCheck = performance.now();

   setInterval(() => {
      const now = performance.now();
      const lag = now - lastCheck - interval;
      lastCheck = now;

      // 如果事件循环延迟超过 10ms，记录日志
      if (lag > 10) {
         console.log(`Event loop lag detected: ${lag.toFixed(2)}ms`);
      }
   }, interval);
}

// 启动监控
monitorEventLoopLag();
