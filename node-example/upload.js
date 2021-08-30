require('dotenv').config({ debug: true })

const { mkdirSync, writeFileSync, existsSync, readFileSync, openSync, opendirSync, readdirSync } = require('fs')
const { join } = require('path')
const { uploadFile } = require('./lib/cos')

async function upload() {
    const path_prefix = './processed'
    const files = readdirSync(path_prefix)

    for (const filename of files) {
        const buffer = readFileSync(join(path_prefix, filename))
        console.log(filename)
        await uploadFile(filename, buffer)
    }
}

;(async() => await upload())()