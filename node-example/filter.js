require('dotenv').config({ debug: true })

const { mkdirSync, writeFileSync, existsSync, readFileSync, openSync } = require('fs')
const { extractRawText } = require('mammoth')
const WordExtractor = require('word-extractor')
const { fromBuffer } = require('file-type')

const { getFileKeyList, getFile, uploadFiles } = require('./lib/cos')

async function filterAndDownload() {
    const wordExtractor = new WordExtractor()

    const path_prefix = './out/files/'
    const path_其他格式 = './out/其他格式.txt'
    const path_未知格式 = './out/未知格式.txt'
    const path_processed = './out/processed.txt'

    mkdirSync(path_prefix, { recursive: true })

    const processedFd = openSync(path_processed, 'a+')
    const processed = readFileSync(processedFd, { encoding: 'utf8'}).split('\n')

    const testRE = /民法通则|民法总则|收养法|担保法|物权法|侵权责任法|婚姻法|继承法|(?<!劳动)合同法/

    let count = 0

    for await (const key of getFileKeyList()) {

        if (processed.includes(key)) {
            continue
        }

        const filename = key.substr(5)
        let path = path_prefix + filename

        if (existsSync(path)) {
            continue
        }

        const buffer = await getFile(key)
        const fileType = await fromBuffer(buffer)

        let text = ''

        if (!fileType) {
            writeFileSync(path_未知格式, filename + '\n', { flag: 'a+' })
            continue
        }

        switch (fileType.mime) {
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                text = (await extractRawText({ buffer })).value
                break;
            case 'application/x-cfb':
                const doc = await wordExtractor.extract(buffer)
                text = doc.getBody()
                break;
            default:
                writeFileSync(path_其他格式, filename + ' ; ' + fileType.ext + '\n', { flag: 'a+' })
                break;
        }

        if (testRE.test(text)) {
            count += 1
            console.log(count)
            writeFileSync(path, buffer)
        }

        writeFileSync(processedFd, key + '\n', { flag:'a+' })
    }

    console.log(count)
}



;(async() => await main())()

// ;(async() => {
//     console.log((await getFile('docs/1ATL1fyReDo2vqMShisnJ')).length)
// })()
