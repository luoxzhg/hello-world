const dayjs = require('dayjs')

const day = dayjs()
console.log(day > day.add(1, 'day'))
console.log(day < day.add(1, 'day'))
console.log(day > day.subtract(1, 'day'))
console.log(day < day.subtract(1, 'day'))