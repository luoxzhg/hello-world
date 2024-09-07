import { EventEmitter, errorMonitor } from 'node:events';

const ee = new EventEmitter({ captureRejections: true });
ee.on(errorMonitor, (err) => { console.log('error moniter => ', err)})
setImmediate(() => {
   ee.emit('error', new Error('test'))
})
