'use strict'
const { readdirSync, readFileSync, mkdirSync, writeFileSync, statSync, unlinkSync, openSync, writeSync } = require('fs')
const { fromBuffer } = require('file-type')
const { extractRawText } = require('mammoth')
const AdmZip = require('adm-zip')
const { join } = require('path')

async function processFiles(dir) {
    const path_prefix_doc = 'out/doc'
    const path_prefix_docx = 'out/docx'
    const path_prefix_不能处理 = 'out/不能处理'
    const path_prefix_不能处理2 = 'out/不能处理2'

    mkdirSync(path_prefix_doc, { recursive: true })
    mkdirSync(path_prefix_docx, { recursive: true })
    mkdirSync(path_prefix_不能处理, { recursive: true })
    mkdirSync(path_prefix_不能处理2, { recursive: true })

    const fd_不能处理 = openSync('out/不能处理/文件名对应的需要替换的法律.csv', 'w')
    const fd_不能处理2 = openSync('out/不能处理2/文件名对应的附则.csv', 'w')

    const testRe = /(?:民法通则|民法总则|收养法|担保法|物权法|侵权责任法|婚姻法|继承法|(?<!劳动)合同法)》?第.{0,5}[条款]/
    const testRe2 = /附.{0,2}[:：].{0,5}法律/
    for (const [filename, buffer] of getFileList(dir)) {
        const fileType = await fromBuffer(buffer)
        let text = ''
        let path_prefix = ''

        switch (fileType.mime) {
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                text = (await extractRawText({ buffer })).value
                text = text.replace(/\s+/g, '')  // 删除所有空白符

                if (testRe2.test(text)) {
                    path_prefix = path_prefix_不能处理2
                    const content = `${filename}, ${text.match(testRe2)[0]}`
                    console.log(content)
                    writeSync(fd_不能处理2, content)
                }
                else if (testRe.test(text)) {
                    path_prefix = path_prefix_不能处理
                    const content = `${filename}, ${text.match(testRe)[0]}`
                    console.log(content)
                    writeSync(fd_不能处理, content)
                } else {
                    path_prefix = path_prefix_docx
                }
                break;
            case 'application/x-cfb':
                path_prefix = path_prefix_doc
                break;
            default:
                throw new Error('something wrong')
                break;
        }

        writeFileSync(join(path_prefix, filename), buffer)
    }
}

// ;(async() => {
//     await processFiles('out/files')
// })()

async function replaceDocxContent(dir) {
    const path_prefix = 'processed'

    mkdirSync(path_prefix, {recursive: true})

    for (const [filename, buffer] of getFileList(dir)) {
        const zip = new AdmZip(buffer)
        const contentEntry = zip.getEntry('word/document.xml')
        const contentText = contentEntry.getData().toString('utf8')
        const contentReplaced = contentText.replace(/民法通则|民法总则|收养法|担保法|物权法|侵权责任法|婚姻法|继承法|(?<!劳动)合同法/g, '民法典')
        contentEntry.setData(Buffer.from(contentReplaced, 'utf8'))
        zip.writeZip(join(path_prefix, filename))
    }
}

;(async() => {
    await replaceDocxContent('./out/docx')
})()

function* getFileList(dir) {
    const path_prefix = dir
    const files = readdirSync(path_prefix)

    for (const filename of files) {
        const filePath = join(dir, filename)

        if (filename.startsWith('.') || statSync(filePath).isDirectory()) {
            continue
        }

        yield [filename, readFileSync(filePath)]
    }
}

module.exports = {
    getFileList,
    processFiles
}