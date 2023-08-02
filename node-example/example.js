const axios = require('axios').default
const path = require('path')
;const { createWriteStream } = require('fs');
(async() => {
  const r = await axios.get('https://qifaxia-contract-audit-1254426977.cos.ap-nanjing.myqcloud.com/765f51fe267%2F%08%20%20%0C%20%20f.pdf', {
    responseType: 'arraybuffer'
  })

  const w = createWriteStream(('/Users/luoxinzheng/response2.pdf'))
  w.write(r.data)
  w.end()
  w.close()
})()
