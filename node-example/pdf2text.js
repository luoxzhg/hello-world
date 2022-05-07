const pdf2text = require('pdf2text')
const pdffile = '/Users/fagougou/Documents/劳动合同 (2).pdf';

;(async() => {
    const result = await pdf2text(pdffile)
    console.log(result)
    console.log(result.map(page => page.join('')).join(''))
})()