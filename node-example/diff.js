const { readFileSync } = require('fs')
const { diffChars } = require('diff')

const oldStr = readFileSync('./diff.txt', {encoding: 'utf-8'})
const newStr = readFileSync('./diff2.txt', {encoding: 'utf-8'})

// const oldStr = 'ABCD'
// const newStr = 'ACCD'
const time = performance.now()
const result = diffChars(oldStr, newStr)
const endTime = performance.now()
const delta = endTime - time

console.log(result)
console.log(oldStr.length, newStr.length, delta)

// const oldStr2 = oldStr.substr(0, oldStr.length/10)
// const time2 = Date.now()
// diffChars(oldStr2, newStr)
// const endTime2 = Date.now()
// const delta2 = endTime2 - time2

// console.log(oldStr2.length, newStr.length,delta2)

// console.log(delta/delta2)

// const time3 = Date.now()
// diffChars(newStr, newStr)
// const endTime3 = Date.now()

// console.log(endTime3 - time3)
