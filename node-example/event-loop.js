setImmediate(() => console.log('this is set immediate 1'));
setImmediate(() => console.log('this is set immediate 2'));
setImmediate(() => console.log('this is set immediate 3'));

setTimeout(() => console.log('this is set timeout 1'), 0);
setTimeout(() => {
    console.log('this is set timeout 2');
    queueMicrotask(() => console.log('this is queueMicrotask inside setTimeout 2'))
    process.nextTick(() => console.log('this is process.nextTick added inside setTimeout 2'));
}, 0);
setTimeout(() => console.log('this is set timeout 3'), 0);
setTimeout(() => console.log('this is set timeout 4'), 0);
setTimeout(() => console.log('this is set timeout 5'), 0);

queueMicrotask(() => console.log('this is queueMicrotask 1'))
Promise.resolve().then(() => {
    console.log('this is Promise.then 1')
    process.nextTick(() => console.log('this is process.nextTick inside Promise.then 1'))
    Promise.resolve().then(() => {
        console.log('this is inner Promise.then inside Promise.then 1')
    })
})
queueMicrotask(() => console.log('this is queueMicrotask 2'))
Promise.resolve().then(() => {
    console.log('this is Promise.then 2')
})

process.nextTick(() => console.log('this is process.nextTick 1'));
process.nextTick(() => {
    Promise.resolve().then(() => {
        console.log('this is inner Promise.then inside process.nextTick 1')
    })
    process.nextTick(console.log.bind(console, 'this is the inner next tick inside next tick 1'));
});
process.nextTick(() => console.log('this is process.nextTick 2'));
