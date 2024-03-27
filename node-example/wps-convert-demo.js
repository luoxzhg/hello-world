'use strict'
const crypto = require('node:crypto')
const http = require('node:http')
const https = require('node:https')
const path = require('node:path')
const url = require('node:url')
const Axios = require('axios').default

const { readFile } = require('node:fs/promises')
const fs = require('node:fs/promises');


const { createReadStream } = require('node:fs');
const { setTimeout } = require('node:timers/promises');

const ak = 'abcd'
const sk = 'abcd';

(async () => {
   let n = 1
   let startTime = performance.now()
   while (n) {
      await test()
      const endTime = performance.now()
      console.log(`test count: ${n++}, usedtime: ${endTime - startTime}ms`)
      // await setTimeout(1000)
   }
})()

async function test() {
   const dirPath = '/Users/luoxinzheng/Documents'
   const dir = await fs.opendir(dirPath)
   const requests = []
   for await (const dirEntry of dir) {
      try {
         if (!dirEntry.isFile()) {
            continue
         }

         const extName = path.extname(dirEntry.name).toLowerCase()
         if (!['.docx', '.doc', '.ppt', '.pptx', '.xls', '.xlsx'].includes(extName)) {
            continue
         }

         // requests.push(() => sendRequest(path.join(dirEntry.path, dirEntry.name))) // node 20
         requests.push(() => sendRequest(dirEntry.path)) // node 18

      } catch (error) {
         console.log(error)
      }
   }

   const result = await Promise.allSettled(requests.map(request => request()))
   result.forEach(result => {
      if (result.status == 'rejected') {
         console.log('rejected error', result.reason)
      }
   })
   console.log('test3')
   return
}

// const axios = Axios.create({
//    baseURL: 'http://wps-compare.fagougou.com/compare'
//    // baseURL: 'https://fagougounew.wpscdn.cn/compare'
// })

async function sendRequest(filePath) {
   await setTimeout(Math.random() * 1000 * 30)

   // try {
   const id = await wpsConvertToPdfCommit(filePath)

   while (1) {
      const [progress, fileData] = await wpsQueryAndDownloadPdf(id)

      if (progress.progress !== 100) {
         await setTimeout(3000)
         continue
      }

      return
   }
   // } catch (error) {
   //    console.log('send Request: ', error)
   // }

   return
}
const axios = Axios.create({
   httpAgent: new http.Agent({ keepAlive: true, keepAliveMsecs: 30000 }),
   // httpsAgent: new https.Agent({ keepAlive: true, keepAliveMsecs: 30000 }),
   // httpAgent: new http.Agent({ keepAlive: false }),
   // httpsAgent: new https.Agent({ keepAlive: false }),
   baseURL: 'http://192.168.6.137:3000',
   // baseURL: 'http://host.docker.internal:3000',
   headers: {
      'Client-Type': 'fagougou',
      'Client-Chan': 'fagougou',
      'Client-Lang': 'zh-cn',
      'Client-Ver': '1.0.0',
      'Content-Type': 'application/json'
   },
   // timeout: 30000
})

axios.interceptors.request.use(config => {
   const method = config.method
   const pathname = (url.parse(config.url)).pathname
   const date = (new Date).toUTCString()
   config.headers['Date'] = date

   const contetnMd5 = config.headers['Content-Md5'] ?? ''
   const contentType = config.headers['Content-Type']
   const clientType = config.headers['Client-Type']

   const token = sign(method, pathname, date, contetnMd5, contentType, clientType)
   // console.log(token)
   config.headers['Authorization'] = token

   // console.log('wps-convert-request')

   return config
})

axios.interceptors.response.use(resp => resp, error => {
   console.log('wps-convert-response-error => ', error)
   if (error.response?.status >= 400 && error.response?.status < 500) {
      return Promise.reject(new Error(`wps转换服务请求端错误: ${error.response?.status}  ${error.response?.data}`))
   }

   if (error.response?.status >= 500) {
      return Promise.reject(new Error(`wps转换服务服务端错误: ${error.response?.status}  ${error.response?.data}`))
   }

   console.log('wps-convert-response-unknown-error => ', error)
   return Promise.reject(error)
})

function sign(method, pathname, date, content_md5, content_type, client_type,) {
   const elems = [];
   [method, pathname, date, content_md5, content_type, client_type].forEach(item => {
      if (item !== "") {
         elems.push(item.toLocaleLowerCase())
      }
   })
   const value = elems.join('&');

   const auth = hmacsha1(sk, value);
   // console.log(auth)
   const base64Token = Buffer.from(auth).toString('base64')
   return `WPS:${ak}:${base64Token}`;
}

function hmacsha1(secret, value) {
   // console.log(secret)
   // console.log(value)
   const hmac = crypto.createHmac('sha1', secret)
   return hmac.update(value).digest('hex')
}

/**
 *
 * @param {string} id
 * @param {Buffer} data
 */
async function uploadPart(id, data) {
   const startTime = performance.now()
   let res = null
   try {
      res = await axios.post(`/api/v1/upload/${id}`, data, {
         headers: {
            'Content-Type': 'application/octet-stream'
         }
      })
   } finally {
      console.log(`uploadPart use time ${performance.now() - startTime}`)
   }

   return res.data
}

async function uploadEnd(id) {
   const startTime = performance.now()
   let res = null
   try {
      res = await axios.put(`/api/v1/upload/${id}`, {})
   } finally {
      console.log(`uploadEnd use time ${performance.now() - startTime}`)
   }
   return res.data
}

/**
 *
 * @param {string} product
 * @param {string} fileid
 * @returns {Promise<string>} task id
 */
async function commit(product, fileid) {
   const startTime = performance.now()
   let res = null
   try {
      res = await axios.post(`/api/v1/commit/${product}`, {
         fileid,
         third_params: { pay_type: 'times' }
      })
   } finally {
      console.log(`commit use time ${performance.now() - startTime}`)
   }
   return res.data.id
}

async function query(committedid) {
   const startTime = performance.now()
   let data = null
   try {
      ({ data } = await axios.get(`/api/v1/query/${committedid}`))
   } finally {
      console.log(`query use time ${performance.now() - startTime}`)
   }
   return data
}

/**
 *
 * @param {{id: string, size: string, md5: string, type: string }} fileObj
 */
async function download(committedid, fileObj) {
   const startTime = performance.now()
   let data = null
   try {
      ({ data } = await axios.get(`/api/v1/download/${committedid}/${fileObj.id}`, {
         headers: {
            'Range': `bytes=0-${fileObj.size}`
         },
         responseType: 'arraybuffer'
      }))
   } finally {
      console.log(`download use time ${performance.now() - startTime}`)
   }

   // const md5 = crypto.createHash('md5').update(data).digest('hex')
   return data
}

async function uploadFile(id, nextpart, nextsize, data) {
   let start = 0
   let nextsleep = 0

   while (nextpart) {
      const partData = data.subarray(start, start + nextsize)
      start += nextsize

      const respData = await uploadPart(id, partData);
      ({ nextpart, nextsize, nextsleep } = respData)

      if (nextsleep) {
         await setTimeout(nextsleep)
      }
   }

   return await uploadEnd(id)
}

/**
 *
 * @param {*} filePath
 * @returns {string} committedid
 */
async function wpsConvertToPdfCommit(filePath) {
   const startTime = performance.now()
   try {
      if (!filePath) {
         throw new Error('file path required')
      }

      const name = path.basename(filePath)
      const type = path.extname(name)?.toLowerCase().slice(1)
      if (type === 'pdf') {
         throw new Error('invalid argument, pdf file should not be converted through wps')
      }

      const data = await readFile(filePath)
      const size = data.length
      const md5 = crypto.createHash('md5').update(data).digest('hex')
      let res = null
      try {
         res = await axios.put('/api/v1/upload', {}, {
            params: { md5, type, size, name }
         })
      } finally {
         console.log(`put use time ${performance.now() - startTime}`)
      }

      const { fileid } = res.status === 201 ? res.data
         : await uploadFile(res.data.id, res.data.nextpart, res.data.nextsize, data)

      let product = null
      switch (type) {
         case 'doc':
         case 'docx':
            product = 'word2pdf'
            break
         case 'xls':
         case 'xlsx':
         case 'et':
         case 'ett':
         case 'csv':
            product = 'excel2pdf'
            break
         case 'ppt':
         case 'pptx':
            product = 'presentation2pdf'
            break
         default:
            throw new Error('不支持的文件格式')
      }

      const result = await commit(product, fileid)

      const endTime = performance.now()
      console.log(`wps-convert-usedtime: ${endTime - startTime}ms`)

      return result
   } catch (err) {
      console.log(err)
      const endTime = performance.now()
      console.log(`wps-convert-error-usedtime: ${endTime - startTime}ms`)
      throw err
   }
}

/**
 *
 * @param {string} committedid
 * @returns {Promise<[{id: string, progress: number}, Buffer]>}
 */
async function wpsQueryAndDownloadPdf(committedid) {
   const result = await query(committedid)
   if (result.progress !== 100) {
      return [result, null]
   }

   const resp = result.resp
   const resultcode = resp.resultcode
   if (resultcode !== 0) {
      throw { code: resp.errcode, message: resp.resultmsg }
   }

   const fileObj = resp.files[0]
   if (!fileObj) {
      console.log(result)
      throw new Error('wps query bad response, unkown error')
   }

   const fileData = await download(committedid, fileObj)

   return [result, fileData]
}
