
## 文件MIME类型
WPS doc
{ ext: 'cfb', mime: 'application/x-cfb' }
MS-DOC

docx
{
  ext: 'docx',
  mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}
pdf
{ ext: 'pdf', mime: 'application/pdf' }


## pdf 提取图片文件
const ImageKind = {
  GRAYSCALE_1BPP: 1,
  RGB_24BPP: 2,
  RGBA_32BPP: 3
}
{
  width: 1654,
  height: 2339,
  kind: 2,
  data: Uint8ClampedArray(11606118) [
     7, 15, 20,  7, 15, 20,  8, 16, 21,  8, 16, 21,
     9, 17, 22, 10, 18, 23, 11, 19, 24, 11, 19, 24,
    14, 22, 27, 14, 22, 27, 14, 22, 27, 13, 21, 26,
    12, 20, 25, 12, 20, 25, 12, 20, 25, 11, 19, 24,
    10, 18, 23, 10, 18, 23, 10, 18, 23,  9, 17, 22,
     8, 16, 21,  7, 15, 20,  5, 13, 18,  4, 12, 17,
     7, 15, 20,  6, 14, 19,  6, 14, 19,  6, 14, 19,
     6, 14, 19,  7, 15, 20,  8, 16, 21,  9, 17, 22,
    10, 18, 23, 10,
    ... 11606018 more items
  ]
}

## Uint8ClampedArray 转为 image
  * canvas.toDataURL 转为 base64, toBuffer 转为 buffer
  * base64 atob 转为 buffer