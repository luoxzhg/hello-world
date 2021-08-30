const fs = require('fs');

const canvasLib = require('canvas');
const pdfjsLib = require('pdfjs-dist/build/pdf.js');

const pdfPath = 'a-1.pdf';
const data = new Uint8Array(fs.readFileSync(pdfPath));

const loadingTask = pdfjsLib.getDocument({ data });

async function extractImages() {
    const doc = await loadingTask.promise;
    const numPages = doc.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        try {
            const page = await doc.getPage(pageNum);
            const opList = await page.getOperatorList();

            for (let i = 0; i < opList.fnArray.length; i++) {
                if (
                    opList.fnArray[i] == pdfjsLib.OPS.paintJpegXObject ||
                    opList.fnArray[i] == pdfjsLib.OPS.paintImageXObject
                ) {
                    const op = opList.argsArray[i][0];
                    const img = page.objs.get(op);

                    if (img.data.length < 50000 ) {
                        continue
                    }
                    // const scale = img.width / page.view[2];
                    // const viewport = page.getViewport({ scale: scale });

                    const canvas = canvasLib.createCanvas(img.width, img.height);
                    const ctx = canvas.getContext('2d');
                    const imageData = ctx.createImageData(img.width, img.height);
                    const imageBytes = imageData.data;

                    for (let j = 0, k = 0, jj = img.width * img.height * 4; j < jj;) {
                        imageBytes[j++] = img.data[k++];
                        imageBytes[j++] = img.data[k++];
                        imageBytes[j++] = img.data[k++];
                        imageBytes[j++] = 255;
                    }

                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.putImageData(imageData, 0, 0);

                    fs.writeFileSync(op + '.png', canvas.toBuffer('image/png'));
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
}

extractImages();

// const { getDocument } = require('pdfjs-dist')
// const { jsPDF } = require('jspdf')
// const canvas = require('canvas')
// // const pdf = new jsPDF()

// // pdf.text('hello world', 10, 20)
// // pdf.save('./1.pdf')
// // const images = []
// // const image_names = []
// // getDocument('./扫描件.pdf').promise.then(pdf => {
// //     for (let i =1; i <= pdf.numPages; i++) {
// //         pdf.getPage(i).then(page => {
// //             page.getOperatorList().then(ops => {
// //                 console.log(ops)
// //                 for (const j = 0; j < ops.fnArray.length; j++) {
// //                     if ([OPS.paintJpegXObject, OPS.paintImageXObject].includes(ops.fnArray[j])) {
// //                         image_names.push(ops.argsArray[j][0])
// //                     }
// //                 }
// //             }).then(dummy => {

// //             })
// //         })
// //     }
// // }).then(d => {

// // })

// ;const { writeFileSync } = require('fs');
// (async() => {
//     const pdf = await getDocument('./a-1.pdf').promise
//     const image_ids = []
//     const images = []

//     const page = await pdf.getPage(1)
//     const ops = await page.getOperatorList()

//     console.log(scale)
//     page.objs.get('img_p0_1', d => {
//         console.log(d.kind, d.width, d.height)

//         const widthScale = d.width / page.view[2]
//         const heightScale = d.height / page.view[3]
//         const pageViewPort = page.getViewport({scale: widthScale})

//         const imageData = new canvas.ImageData(d.data, d.width, d.height)
//         const imageCanvas = new canvas.Canvas(imageData.width, imageData.height, 'image')
//         const ctx = imageCanvas.getContext('2d')

//         ctx.putImageData(imageData,0, 0)
//         const base64 = imageCanvas.toDataURL()
//         console.log(base64.substr(0, 100))
//         const imageBuffer = Buffer.from(base64.split('base64,')[1], 'base64')
//         writeFileSync('1.png', imageBuffer)
//         // const base64 = d.data.map(b => String.fromCharCode(b)).join("")
//         // console.log(base64.sub(0, 100))
//         // // writeFileSync('1.png', Buffer.from(base64, 'base64'))
//     })

//     // const ops = await page.getOperatorList()
//     // for (const j = 0; j < ops.fnArray.length; j++) {
//     //     if ([OPS.paintJpegXObject, OPS.paintImageXObject].includes(ops.fnArray[j])) {
//     //         image_ids.push(ops.argsArray[j][0])
//     //     }
//     // }
//     // for (const id of image_ids) {
//     //     page.objs.get('img_p0_1', d => images.push(d))
//     // }

// })()