const { promisify, inspect } = require('util')
const { readFileSync } = require('fs')

const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
grpc.status.UNAVAILABLE
const OCR_SERVER = '139.199.226.152:1232'

const packageDefinition = protoLoader.loadSync('./ocr.proto')

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)

// console.log(protoDescriptor)

const imo_ocr = protoDescriptor.imo_ocr

// console.log(imo_ocr.ExecReq)

const client = new imo_ocr.imo_service(OCR_SERVER, grpc.credentials.createInsecure())

const ocr_service = promisify(client.imo_ocr.bind(client))

const metadata = new grpc.Metadata({
    cacheableRequest: true
})

const callOptions = {
    deadline: Date.now() + 10*1000
}
const buffer = readFileSync('./a')

const result = ocr_service({
    image: buffer,
    maxLines: 100
}, metadata, callOptions).then(data => {
    strs = data.ocrInfos.sort((a, b) =>{
        const lineHeight = ((a.points[3].y - a.points[0].y) + (a.points[2].y - a.points[1].y)) / 2
        const dy = a.points[0].y - b.points[0].y
        if ( dy < -lineHeight) {
            // a 应该是上一行
            return -1
        } else if (lineHeight <= dy) {
            // a 应该是下一行
            return 1
        } else {
            // a, b 在同一行
            return a.points[0].x - b.points[0].x
        }
    })
    console.log(inspect(strs, false, null, true))
}).catch(e => {
    console.log(e)
})
