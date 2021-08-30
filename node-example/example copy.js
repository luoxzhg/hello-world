// const AdmZip = require('adm-zip')

// const zip = new AdmZip("/Users/luoxinzheng/response.docx")
// for (const entry of zip.getEntries()) {
//     console.log(entry.name,' : ', entry.entryName,' : ', entry.rawEntryName)
//     if (entry.name === 'document.xml') {
//         console.log(entry.getData().toString('utf8'))
//     }
// }

const {mkdirSync, writeFileSync, readdirSync } = require('fs')
for (const file of readdirSync('./out/docx')) {
    console.log(file)
}