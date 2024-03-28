const { EventEmitter } = require('node:events');

const emitter = new EventEmitter();

function listener() {
   console.log('listener started')
   setImmediate(() => console.log('nested listener started'))
}
console.log('before newListener')
emitter.on('e', listener)

emitter.on('newListener', () => {
   console.log('new listener')
})

console.log('after newListener')
emitter.on('e', listener)

// emit 同步发布事件，并且按次序同步执行监听器
console.log('before emitted event: e')
emitter.emit('e')
console.log('after emitted event: e')

// emitter.emit('error', new Error('whoops!'));
