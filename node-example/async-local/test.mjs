'use strict'

import { setImmediate } from 'node:timers/promises';
import context from './context-store.mjs';
import EventEmitter from 'node:events';

const ee = new EventEmitter
ee.on('a', f2)

async function main(id) {
    await context.run({ id }, async () => {
        await f1()
        process.nextTick(async() => {
            await setImmediate()
            ee.emit('a')
        })
    })
}

async function f1() {
    const ctx = context.getStore()
    console.log('in f1: ', ctx)
    await setImmediate()
    ctx.newId = 2
}

async function f2() {
    await setImmediate()
    setTimeout(()=>{
        queueMicrotask(async() => {
            const ctx = context.getStore()
            console.log('in f2: ', ctx)
        })
    })
}

main(1)
main(2)
