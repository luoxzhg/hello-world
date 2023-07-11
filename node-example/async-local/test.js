'use strict'
const { setImmediate } = require('node:timers/promises');
const asyncContext = require('./context-store');

async function main(id) {
    await asyncContext.run({ id }, async () => {
        await f1()
        return f2()
    })
}

async function f1() {
    const ctx = asyncContext.getStore()
    console.log(ctx)
    await setImmediate()
    ctx.newId = 2
}

async function f2() {
    const ctx = asyncContext.getStore()
    console.log(ctx)
}

main(1)
main(2)
