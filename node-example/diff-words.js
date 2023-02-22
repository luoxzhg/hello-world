const { diffWords } = require('diff');

const a = 'abc   abc def dd dddf'
const b = 'abc\n abca abc def dd dddf'

const result = diffWords(b, a, {
   // ignoreWhitespace: true
})
console.log(result)
