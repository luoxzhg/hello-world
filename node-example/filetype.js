const filePaths = ['./保密协议6.rtf', '1_01.png', 'text.txt']

const { isBinaryFileSync } = require('isbinaryfile')
const { isText, isBinary } = require('istextorbinary')
const { fromFile } = require('file-type')


for (const filePath of filePaths) {
    console.log(filePath)
    console.log(isBinaryFileSync(filePath))

    console.log(isBinary(filePath))

    fromFile(filePath).then(result => console.log(result))
}
