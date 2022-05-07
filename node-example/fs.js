const fs = require('fs/promises')
const { constants } = require('fs')

;(async() => {
    const text = await fs.readFile('./a.txt', 'ascii')
    const buf = Buffer.from(text, 'base64')
    // console.log(buf)
    await fs.writeFile('./a.png', buf)
})()