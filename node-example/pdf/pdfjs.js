const pdfjs = require('pdfjs-dist/legacy/build/pdf');
const canvasLib = require('canvas');

const { OCR_SERVER } = require('../config')
const { ocrSvcAsync } = require('../ocrr');

/**
 * 从 PDF 中获取文本框
 * @param {string | Buffer} url or buffer
 * @returns {Promise<{  text: string, pages: { text: string, pageNum: number, items: {char: string, height: number, width: number, x: number, y: number}[]}[]}>}
 */
async function getTextFromPDFFile(buffer) {
    let pages = []
    for await (const textObj of getTextContentPerPage(buffer)) {
        pages.push(textObj)
    }
    removeHeaderAndFooterAllPages(pages)
    const text = pages.map(page => page.items.map(item => item.char).join('')).join('')
    return {
        text,
        pages
    }
}

/**
 * @returns { { text: string, pageNum: number, items: {char: string, height: number, width: number, x: number, y: number}[]}}
 */
async function* getTextContentPerPage(buffer) {
    const pdfDoc = await pdfjs.getDocument(buffer).promise

    for (let index = 0; index < pdfDoc.numPages; index++) {
        const pageNum = index + 1
        const page = await pdfDoc.getPage(pageNum);

        let itemsPerPage = []
        for (const textItem of (await page.getTextContent({ normalizeWhitespace: true })).items) {
            itemsPerPage.push(normalizedTextItem(textItem, page.view[3]))
        }
        // * 扫描版 PDF
        if (!itemsPerPage.length && OCR_SERVER) {
            itemsPerPage = await getTextItemsFromImagePage(page)
        }

        const bodyTextItems = removedHeaderAndFooterPerPage(itemsPerPage, page.view[3])
        const text = concatTextFromTextItems(bodyTextItems, page.view[2])
        const items = getCharItems(bodyTextItems)

        yield ({
            pageNum,
            // text,
            items,
        })
    }
}

async function getTextItemsFromImagePage(page) {
    const items = []

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
        const img = await getPageObject(objId);

        // * 过滤掉水印之类的小图像
        if (img.data.length < 50 * 1000) {
            continue
        }

        const canvas = canvasLib.createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(img.width, img.height);

        for (let j = 0, k = 0, jj = img.width * img.height * 4; j < jj;) {
            imageData.data[j++] = img.data[k++];
            imageData.data[j++] = img.data[k++];
            imageData.data[j++] = img.data[k++];
            imageData.data[j++] = 255;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.putImageData(imageData, 0, 0);

        const pngBuffer = canvas.toBuffer('image/png');

        const ocrResult = await ocrSvcAsync(pngBuffer)
        // * 剔除页码，页码在每一页最后一行
        if (ocrResult.length > 0) {
            const last = ocrResult[ocrResult.length - 1]
            if (last && _isPageNum(last.ocrStr)) {
                ocrResult.pop()
            }
        }

        // * PDF 页面与图像间的缩放比例，将图像缩放到页面同等大小
        const scale = page.view[2] / img.width;
        for (const ocrStrObj of ocrResult) {
            // 模糊字符忽略
            // if (ocrStrObj.confidence < 0.6) {
            //     continue
            // }

            const x = ocrStrObj.points[0].x * scale
            const y = ocrStrObj.points[0].y * scale

            // // * 忽略页眉页脚，只支持单行
            // if (y < img.height / 12 || y > -img.height / 12 + img.height) {
            //     continue
            // }

            items.push({
                str: ocrStrObj.ocrStr,
                x,
                y,
                width: ocrStrObj.points[2].x * scale - x,
                height: ocrStrObj.points[2].y * scale - y
            })

            // * 像 PDF 一样插入 hasEOL
            items.push({
                str: '',
                x: ocrStrObj.points[1].x * scale,
                y,
                width: 0,
                height: 0,
                hasEOL: true
            })
        }
        return items
    }

    return items

    /**
     *  判断一段文本是否是文档页码
     * @param {string} str
     */
    function _isPageNum(str) {
        if (str.match(/^\s*(-?\d+-?|第.{1,3}页.{1,5}页)\s*$/)) {
            return true
        }
    }
}

/**
 * 添加 x 和 y 坐标
 * PDF 页面原点在左下角，y 轴向上
 * 坐标原点改为左上角，y 轴方向向下
 * @param {*} textItem
 * @returns
 */
function normalizedTextItem(textItem, pageHeight) {
    // 空格没有行高
    const rawHeight = textItem.height ? textItem.height : textItem.transform[0];

    textItem.x = textItem.transform[4]
    textItem.y = pageHeight - textItem.transform[5] - (rawHeight / 1.10) // 染色文本框上部多出一点点，将文本框下移一点点

    // 高度短了一截，没有覆盖到字体底部
    textItem.height = (rawHeight) * 1.15

    return textItem
}

/**
 * 去除页码、页眉与页脚，只限单行，并不能完全去除
 * @param {*} textItems
 * @param {*} pageWidth
 * @param {*} pageHeight
 */
function removedHeaderAndFooterPerPage(textItems, pageHeight) {
    const result = []
    for (const item of textItems) {
        // 字体大小对文本框坐标有影响，文本框 Y 坐标也是字体基线的 Y 坐标【猜测】
        if (item.y < pageHeight / 19 || item.y > -pageHeight / 12.5 + pageHeight) {
            // 页眉在前，页码在后，因此，如果有页码则清空 result
            // gotenberg 转换的页脚在末尾，页码在前；WPS 转换的页脚页码都在前
            // 加上 result.length 判断，防止意外
            // if (result.length <= 10) {
            //     result.splice(0, result.length)
            // }
            continue
        }
        result.push(item)
    }
    return result
}

/**
 * 通过比对每页首尾去除页眉页脚，但无法去除页码，以及其他有变化的内容
 */
function removeHeaderAndFooterAllPages(pages) {
    if (pages.length <= 1) {
        return
    }
    while (true) {
        const firstItemStrSet = new Set()
        const lastItemStrSet = new Set()

        for (const page of pages) {
            if (!page.items.length) {
                return
            }
            firstItemStrSet.add(page.items[0].char)

            // 排除页末换行符
            let lastCharIndex = page.items.length - 1
            let lastChar = page.items[lastCharIndex].char
            while (lastChar === '\n') {
                lastChar = page.items[--lastCharIndex]?.char
            }
            lastItemStrSet.add(lastChar)
        }

        if (firstItemStrSet.size !== 1 && lastItemStrSet.size !== 1) {
            return
        }

        // 如果每页的首项都相同，则认为是页眉，去除
        if (firstItemStrSet.size === 1) {
            for (const page of pages) {
                page.items.splice(0, 1)
            }
        }
        // 如果每页的尾项都相同，则认为是页脚，去除
        if (lastItemStrSet.size === 1) {
            for (const page of pages) {
                let removedIndex = page.items.length - 1
                let lastChar = page.items[removedIndex].char
                // 排除页末的换行符
                while (lastChar === '\n') {
                    removedIndex--
                    lastChar = page.items[removedIndex]?.char
                }
                if (removedIndex > 0) {
                    page.items.splice(removedIndex, 1)
                }
            }
        }
    }
}

const lineTerminator = [
    '。', '！', '？', '：',
    '.', '!', '?', ':',
]

const isBlank = str => (/^\s+$/).test(str)
/**
 * 连接文本框，并在需要的位置插入换行符
 * @param {TextItem[]} textItems
 */
function concatTextFromTextItems(textItems, pageWidth) {
    const [minLineStart, maxLineEnd] = lineMarginStartAndEnd(textItems)

    // 每页最后一行不会带有 hasEOL 标志，需要我们自己加上
    if (textItems.length) {
        textItems[textItems.length - 1].hasEOL = true
    }

    let textRecord = []
    let lastLineEnd = 0
    let lastChar = ''
    let lastLineCharWidth = 0
    for (const item of textItems) {
        const currentLineEnd = item.x + item.width
        const currentEndChar = item.str[item.str.length - 1] || ''
        // 忽略空字符和空白字符的宽度，空白字符宽度异常导致无法判断正常的最大行宽
        const currentLineCharWidth = item.str && isBlank(item.str) ? 0 : item.width / item.str.length

        // hasEOL 只判断是否是页面上显示的一行是否结束，而非文本内的换行符
        // hasEOL 有时在本行末尾，有时在所下一行开头，有时带有字符串，有时是空字符串
        if (item.hasEOL) {
            // hasEOL 为 true 时，表示页面中一行结束，item.str 可能不为空
            // 如果 item.str 不为空字符串，则使用当前的文本块作为一行的最后一块，否则使用上一个文本块
            if (item.str) {
                lastLineEnd = currentLineEnd
                lastChar = currentEndChar
                lastLineCharWidth = currentLineCharWidth
            }

            if (lastLineEnd < pageWidth * 3 / 4 // 行尾少于页面 3/4
                || lastLineEnd < maxLineEnd - lastLineCharWidth * 5 // 行尾比最大行少 5 个全角字符
                // 少一个字符并且本行最后一个字符是句结束判断
                || (lastLineEnd < maxLineEnd - lastLineCharWidth * 2 && lineTerminator.includes(lastChar))
            ) {
                // hasEOL 为 true 时，表示页面中一行结束，item.str 可能不为空
                // 如果是一段结束，则添加换行符 '\n'，否则不变
                item.str += '\n'
            }
        }
        textRecord.push(item.str)
        lastLineEnd = currentLineEnd
        lastChar = currentEndChar
        lastLineCharWidth = currentLineCharWidth ? currentLineCharWidth : lastLineCharWidth // 排除宽度异常的文本段
    }
}


function lineMarginStartAndEnd(textItems) {
    let minLineStart = Infinity
    let maxLineEnd = 0
    for (const item of textItems) {
        // 排除空字符串以及空白字符串，因为空白字符串有可能宽度异常的大，超出正常的边界，导致无法正确判断是否换行
        if (!item.str || isBlank(item.str)) {
            continue
        }

        if (item.x < minLineStart) {
            minLineStart = item.x
        }

        const lineEnd = item.x + item.width
        if (lineEnd > maxLineEnd) {
            maxLineEnd = lineEnd
        }
    }
    return [minLineStart, maxLineEnd]
}

/**
 * 按字计算文本框位置
 * @param {*} textItems
 * @returns
 */
function getCharItems(textItems) {
    const result = []
    for (const item of textItems) {
        const chars = Array.from(item.str)
        const len = chars.length

        chars.forEach((char, index) => {
            result.push({
                char,
                x: item.x + (index * item.width / len),
                y: item.y,
                width: item.width / len,
                height: item.height
            })
        })
    }
    return result
    // // TODO 表格单元格内文本换行，导致文本顺序不对
    // // 排序，PDF 提取出来的部分非字符号顺序不对
    // // 同一行的 y 坐标有少许波动
    // return result.sort((a, b) => {
    //     const dy = a.y - b.y
    //     const halfHeight = (a.height / 2 + b.height / 2) / 2
    //     if (dy < -halfHeight) {
    //         return -1
    //     } else if (dy > halfHeight) {
    //         return 1
    //     } else {
    //         return a.x - b.x
    //     }
    // })
}

module.exports = {
    getTextFromPDFFile,
}

if (require.main === module) {
    (async (path) => {
        const { readFileSync } = require('fs');
        const buf = readFileSync(path)

        const { text } = await getTextFromPDFFile(buf)
        console.log(text)

        // // })('/Users/fagougou/Desktop/劳动合同书.pdf')
        // })('/Users/fagougou/Desktop/劳动合同书（大码页脚页码）.pdf')
        // })('/Users/fagougou/Desktop/劳动合同书（页脚）.pdf')
        // })('/Users/fagougou/Desktop/大页脚.pdf')
        // })('/Users/fagougou/Desktop/大页脚页码.pdf')
        // })('/Users/fagougou/Desktop/页脚.pdf')
        // })('/Users/fagougou/Desktop/a-1.pdf')
        // })('/Users/fagougou/Desktop/a.pdf')
        // })('/Users/fagougou/Desktop/b.pdf')
        // })('/Users/fagougou/Desktop/aa.pdf')
        // })('/Users/fagougou/Documents/ye-mei-ye-jiao1.pdf')
        // })('/Users/fagougou/Documents/a-1.pdf')
        // })('/Users/fagougou/Documents/设备采购合同50页图片.pdf')
        // })('/Users/fagougou/Documents/设备采购合同50页比对.pdf')
        // })('/Users/fagougou/Documents/设备采购合同50页(docx).pdf')
        // })('/Users/fagougou/Documents/法培学院讲师合作协议.pdf')
        // })('/Users/fagougou/Documents/建设工程设计合同50ye.pdf')
        // })('/Users/fagougou/Documents/7-页脚.pdf')
        // })('/Users/fagougou/Documents/7-页脚页码.pdf')
    })('/Users/fagougou/Desktop/保密协议（页码）.pdf')
    // })('/Users/fagougou/Desktop/页眉去多了.pdf')
    // })('/Users/fagougou/Desktop/页脚去多了.pdf')
}
