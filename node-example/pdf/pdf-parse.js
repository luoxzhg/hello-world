// pdf2json buggy, no support anymore, memory leak, throws non - catchable fatal errors
// j-pdfjson fork of pdf2json
// pdf-parser buggy, no tests
// pdfreader using pdf2json
// pdf-extract not cross - platform using xpdf
const { readFile } = require('fs/promises')
const pdfparse = require('pdf-parse')

const pdffile = '/Users/fagougou/Documents/劳动合同 (2).pdf';

; (async () => {
    const buf = await readFile(pdffile)
    const result = await pdfparse(buf)
    // console.log(result)
    console.log(result.text)
    // console.log(result.text.split('\n').join(''))
})()