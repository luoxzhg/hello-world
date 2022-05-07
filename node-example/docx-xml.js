const fs = require('fs/promises')

const shifts = {
    ':': '：',
    '(': '（',
    ')': '）',
    ';': '；',
    ',': '，'
}
;(async() => {
    const s = await fs.readFile('document.xml', 'utf-8')
    const s2 = s.replaceAll(/(?<=<w:t[^>]*>)[^<]*(?=<\/w:t>)/g,  matched => matched.replace(/[:();,]/g, match2 => shifts[match2]))
    await fs.writeFile('document2.xml', s2, 'utf-8')
})()