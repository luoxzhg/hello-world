const COS = require('cos-nodejs-sdk-v5')

const cos = new COS({
    SecretId: process.env.COS_SECRET_ID,
    SecretKey: process.env.COS_SECRET_KEY
});

const Bucket = 'contract-template-1254426977'
const Region = 'ap-guangzhou'
const Prefix = 'docx/'

/**
 * 获取 'docx/'目录下所有文件名
 */
async function* getFileKeyList() {
    // * getBucket 每次最多只能返回 1000 条
    let Marker = Prefix
    let IsTruncated = 'true'

    while (IsTruncated === 'true') {
        const result = await cos.getBucket({
            Bucket,
            Region,
            Prefix,
            Marker
        })

        IsTruncated = result.IsTruncated
        Marker = result.NextMarker

        const Contents = result.Contents
        for (const content of Contents) {
            yield content.Key
        }
    }
}

/**
 * @description 获取文件内容
 * @param {string} Key
 */
async function getFile(Key) {
    const result = await cos.getObject({
        Bucket,
        Region,
        Key
    })

    return result.Body
}

async function uploadFile(filename, Body) {
    const result = await cos.putObject({
        Bucket,
        Region,
        Key: Prefix + filename,
        Body,
        StorageClass: 'STANDARD'
    })
    return result
}

module.exports = {
    getFileKeyList,
    getFile,
    uploadFile,
}
