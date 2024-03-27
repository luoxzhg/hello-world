const old = ['达到啊','dodo', '，', '多多', '。', 'do', 'i', 'should', 'do']
const news = ['到达', '，', 'dodo','。', '多多', '。', 'may', 'you', 'should', 'do']

const DiffLib = require('./pkg')

const result = DiffLib.diff_slices(old, news)
console.log(result)
