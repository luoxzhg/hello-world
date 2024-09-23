import { once, EventEmitter } from 'node:events';

// const ee = new EventEmitter;

// setImmediate(() => {
//    ee.emit('data', 'some data')
// });

// const result = await once(ee, 'data');

const ee = new EventTarget;
setImmediate(() => {
   const event = new Event('data', { data: 'some data'});
   ee.dispatchEvent(event);
})
const result = await once(ee, 'data');
console.log(result);
