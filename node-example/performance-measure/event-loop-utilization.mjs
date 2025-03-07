let lastELU = performance.eventLoopUtilization();

setInterval(() => {
   console.log('Start', new Date());
   const tmp = performance.eventLoopUtilization();
   console.log(performance.eventLoopUtilization(tmp, lastELU));
   lastELU = tmp;
   console.log('End', new Date());
}, 0);
