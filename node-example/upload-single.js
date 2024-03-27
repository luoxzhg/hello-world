'use strict'
const crypto = require('node:crypto')
const fs = require('node:fs/promises');
const path = require('node:path');
const Axios = require('axios').default;
const formData = require('form-data');
const { createReadStream } = require('node:fs');
const { setTimeout } = require('node:timers/promises');


(async () => {
   while (1) {
      try {
         console.log('test1')
         await test()
         console.log('test2')
      } catch (error) {
         console.log(error)
      }
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

         requests.push(() => sendRequest(path.join(dirEntry.path, dirEntry.name)))

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

   return
}

const axios = Axios.create({
   baseURL: 'http://wps-compare.fagougou.com/compare'
   // baseURL: 'https://fagougounew.wpscdn.cn/compare'
})

async function sendRequest(filePath) {
   await setTimeout(Math.random() * 1000 * 60)
   const form = new formData({
      maxDataSize: Infinity
   })

   const taskId = crypto.randomUUID()
   form.append('taskId', taskId)
   form.append('usedAs', 'origin')
   form.append('file', createReadStream(filePath))

   // try {
      const { data } = await axios.post('/v3/uploadSingle', form, {
         headers: form.getHeaders(),
         maxBodyLength: Infinity
      })

      if (data.code === 0) {
         while (1) {
            const res2 = await axios.get(`/v3/query/${taskId}/origin/${data.data.committedid}`)
            if (res2.data.code !== 0) {
               console.log('QUERY =>', res2.data)
               return
            }
            if (res2.data.code === 0 && res2.data.data.progress !== 100) {
               await setTimeout(3000)
               continue
            }

            return
         }
      }
      else {
         console.log('UPLOAD => ', data)
      }
   // } catch (error) {
   //    console.log('send Request: ', error)
   // }

   return
}
