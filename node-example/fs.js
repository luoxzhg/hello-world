const fs = require('fs/promises')
const { constants } = require('fs')

;(async() => {
    const stat = await fs.access('something-does-not-exist', constants.F_OK)   // Error: no such file or directory
    console.log(stat)
})()