const { EventEmitter } = require('node:events');

const emitter = new EventEmitter();

function listener() {
   console.log('listener started')
   setImmediate(() => console.log('nested listener started'))
}

emitter.on('e', listener)

emitter.emit('e')
console.log('emitted event: e')

// emit 同步发布事件，并且按次序同步执行监听器
