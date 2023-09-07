import { readFile, writeFile } from "node:fs/promises";
import Pizzip from "pizzip";
import Docxtemplater from "docxtemplater";

(async() => {
   const content = await readFile('tag-example.docx')
   const pizzip = new Pizzip(content)
   const doc = new Docxtemplater(pizzip, {
      linebreaks: true,
      paragraphLoop: true,
   })

   doc.render({
      items: [
         {name: 'a', order: 1},
         {name: 'b', order: 2},
         {name: 'c', order: 3},
         {name: 'd', order: 4},
      ]
   })

   const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
   })
   await writeFile('output.docx', buf)
})()
