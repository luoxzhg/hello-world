const { readPdfText } = require('pdf-text-reader')

const pdffile = '/Users/fagougou/Documents/劳动合同 (2).pdf';
// const pdffile = '/Users/fagougou/Desktop/111222(1).pdf';

;(async() => {
    const pages = await readPdfText(encodeURIComponent(pdffile))
    console.log(pages)
})()