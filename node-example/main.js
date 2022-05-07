const fs = require('fs')
const path = require('path')
const pdf = require('pdf-parse')
const { getText } = require('any-text')
const WordExtractor = require('word-extractor')
const extractText = require('office-text-extractor')
const fileType = require('file-type')
const pdf2txt = require('pdf2txt')

const filename = '/Users/fagougou/Documents/response.doc';
// const docxfile = '/Users/fagougou/Documents/response.docx';
const docxfile = '/Users/fagougou/Desktop/111222.docx';
const pdffile = '/Users/fagougou/Documents/劳动合同 (2).pdf';

((((((((()))))))))
(async() => {
    // // const text = await getText(filename)
    // const doc = await (new WordExtractor()).extract(filename)
    // console.log(doc.getBody())
    // const buf = fs.readFileSync(pdffile)
    // const data = await pdf(buf)
    // console.log(data.text)
    let text = await extractText(docxfile)
    // text = text.replace(/[\s]/g, '')
    console.log(text)
    // console.log(JSON.stringify(text))
    // console.log(await fileType.fromFile(filename))
    // console.log(await fileType.fromFile(docxfile))
    // console.log(await fileType.fromFile(pdffile))
    // const output = await pdf2txt.read(pdffile)
    // console.log(JSON.stringify(output))
    // const output2 = output.split('\t ').join('')
    // const output2 = output.split(/\s+/g).join('')
    // console.log(output2)
    // console.log(output)
})()
