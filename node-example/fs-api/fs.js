const fs = require('fs/promises');
const path = require('path');
const { constants } = require('fs');

(async() => {
    const buffer = await fs.readFile(path.join(__dirname, 'target.txt'))
    console.log(buffer)
})()
