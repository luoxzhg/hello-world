'use strict'
const { AsyncLocalStorage, AsyncResource, createHook, executionAsyncId, executionAsyncResource, triggerAsyncId } = require('node:async_hooks');

console.log('in main')
console.log('triggerAsyncId', triggerAsyncId())
console.log('executionAsyncId', executionAsyncId())
console.log('executaionAsyncResource', executionAsyncResource())
const r = executionAsyncResource()
r.a = "test"
console.log('executaionAsyncResource', executionAsyncResource())

setImmediate(()=>{
    console.log('in callback')
    console.log('triggerAsyncId', triggerAsyncId())
    console.log('executionAsyncId', executionAsyncId())
    console.log('executaionAsyncResource', executionAsyncResource())
    const r = executionAsyncResource()
    r.a = "test"
    console.log('executaionAsyncResource', executionAsyncResource())
})
