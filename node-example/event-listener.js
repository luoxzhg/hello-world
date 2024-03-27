const { EventEmitter } = require('node:events');

const emitter = new EventEmitter();

function listener() {
   console.log('listener started')
   setImmediate(() => console.log('nested listener started'))
}

emitter.on('newListener', () => {
   console.log('new listener')
})

console.log('after newListener')
emitter.on('e', listener)

// emit 同步发布事件，并且按次序同步执行监听器
emitter.emit('e')
console.log('emitted event: e')

// emitter.emit('error', new Error('whoops!'));
