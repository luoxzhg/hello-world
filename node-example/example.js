const axios = require('axios').default
const path = require('path')
;const { createWriteStream } = require('fs');
(async() => {
  const r = await axios.get('https://qifaxia-contract-audit-1254426977.cos.ap-nanjing.myqcloud.com/18312879887/docs/%E5%8A%B3%E5%8A%A8%E5%90%88%E5%90%8C%E4%B9%A6.docx', {
    responseType: 'arraybuffer'
  })

  const w = createWriteStream(('/Users/luoxinzheng/response.docx'))
  w.write(r.data)
  w.end()
  w.close()
})()
