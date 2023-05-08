const canvasLib = require('canvas');
const pdfjs = require('pdfjs-dist/legacy/build/pdf');

/**
 * require('pdfjs-dist/types/src/display/api');
 * @param {PDFPageProxy} page
 * @returns {Promise<Buffer>}
 */

async function extractRenderedImageAsync(page, _scale =1.0) {
    // Render the page on a Node canvas with 200% scale.
    const scale = _scale
    const viewport = page.getViewport({ scale });
    const canvasFactory = new NodeCanvasFactory();
    const canvasAndContext = canvasFactory.create(
        viewport.width,
        viewport.height
    );
    const renderContext = {
        canvasContext: canvasAndContext.context,
        viewport,
        canvasFactory,
    };

    const renderTask = page.render(renderContext);
    await renderTask.promise;

    // Convert the canvas to an image buffer.
    const pngBuffer = canvasAndContext.canvas.toBuffer('image/png');
    return pngBuffer
}

/**
 *
 * @param {PDFPageProxy} page
 * @returns {[number, Buffer]}
 */
async function extractRawImageAsync(page) {
    const img = await _getFirstImage();
    const canvas = canvasLib.createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    const imageData = ctx.createImageData(img.width, img.height);
    for (let j = 0, k = 0, jj = img.width * img.height * 4; j < jj;) {
        imageData.data[j++] = img.data[k++];
        imageData.data[j++] = img.data[k++];
        imageData.data[j++] = img.data[k++];
        imageData.data[j++] = 255;
    }
    ctx.putImageData(imageData, 0, 0);

    const pngBuffer = canvas.toBuffer('image/png');
    const scale = page.view[2] / img.width;

    return [scale, pngBuffer]

    // 经观察，水印不会是第一个图像，因此可以直接返回第一个图像即可
    async function _getFirstImage() {
        const opList = await page.getOperatorList();
        for (let i = 0; i < opList.fnArray.length; i++) {
            if (opList.fnArray[i] !== pdfjs.OPS.paintJpegXObject
                && opList.fnArray[i] !== pdfjs.OPS.paintImageXObject
            ) {
                continue
            }

            const objId = opList.argsArray[i][0];
            const getPageObject = objId => new Promise((resolve, reject) => {
                const _getPageObject = objId.startsWith("g_") ? page.commonObjs.get.bind(page.commonObjs) : page.objs.get.bind(page.objs)
                _getPageObject(objId, data => {
                    resolve(data)
                })
            })

            // // * 过滤掉水印之类的小图像, WPS水印尺寸 911200
            // if (img.data.length < 1e7) {
            //     continue
            // }
            // 经观察，水印不会是第一个图像，因此可以直接返回第一个图像即可
            return await getPageObject(objId);
        }
    }
}


module.exports = {
    extractRenderedImageAsync,
    extractRawImageAsync,
}


function NodeCanvasFactory() { }
NodeCanvasFactory.prototype = {
    create: function NodeCanvasFactory_create(width, height) {
        // assert(width > 0 && height > 0, "Invalid canvas size");
        const canvas = canvasLib.createCanvas(width, height);
        const context = canvas.getContext("2d");
        return {
            canvas,
            context,
        };
    },

    reset: function NodeCanvasFactory_reset(canvasAndContext, width, height) {
        // assert(canvasAndContext.canvas, "Canvas is not specified");
        // assert(width > 0 && height > 0, "Invalid canvas size");
        canvasAndContext.canvas.width = width;
        canvasAndContext.canvas.height = height;
    },

    destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
        // assert(canvasAndContext.canvas, "Canvas is not specified");

        // Zeroing the width and height cause Firefox to release graphics
        // resources immediately, which can greatly reduce memory consumption.
        canvasAndContext.canvas.width = 0;
        canvasAndContext.canvas.height = 0;
        canvasAndContext.canvas = null;
        canvasAndContext.context = null;
    },
};