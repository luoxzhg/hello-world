// import { EventEmitter, once } from 'node:events';
// import process from 'node:process';

// const myEE = new EventEmitter();

// async function foo() {
//    await once(myEE, 'bar');
//    console.log('bar');

//    // This Promise will never resolve because the 'foo' event will
//    // have already been emitted before the Promise is created.
//    await once(myEE, 'foo');
//    console.log('foo');
// }

// process.nextTick(() => {
//    myEE.emit('bar');
//    myEE.emit('foo');
// });

// foo().then(() => console.log('done'));
import { EventEmitter } from 'node:events';

const emitter = new EventEmitter({ captureRejections: true });
emitter.on('error', error => {
   console.log('in error listener')
})
// process.on('uncaughtException', error => console.log('process'))
// process.on('beforeExit', () => console.log('beforeExit'))
emitter.on('wrong', () => {
   console.log('wrong event listener')
   // process.nextTick(() => {
      throw new Error('wrong')
   // })
   console.log('after')
})

// setImmediate(() => {
//    console.log('next tick')
// })
emitter.emit('wrong')
console.log('after emit')

// function listener() {
//    console.log('listener started')
//    setImmediate(() => console.log('nested listener started'))
// }
// console.log('before newListener')
// emitter.on('e', listener)

// emitter.on('newListener', () => {
//    console.log('new listener')
// })

// console.log('after newListener')
// emitter.on('e', listener)

// // emit 同步发布事件，并且按次序同步执行监听器
// console.log('before emitted event: e')
// emitter.emit('e')
// console.log('after emitted event: e')
