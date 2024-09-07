const p = Promise.resolve();
queueMicrotask(() => console.log('microtask in main'));
p.then(() => {
   console.log('then 1 callback')
   queueMicrotask(() => console.log('microtask in then 1'));
   process.nextTick(() => console.log('nextTick in then 1'));
})

p.then(() => {
   console.log('then 2 callback')
   queueMicrotask(() => console.log('microtask in then 2'));
})

p.finally(() => {
   console.log('finally callback');
});

process.nextTick(() => console.log('nextTick in main'));

console.log('main')
setTimeout(() => console.log('timeout'))
