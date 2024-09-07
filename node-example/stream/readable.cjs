const { Readable } = require('node:stream');

const readable = Readable.from('abcd');

setImmediate(() => {


});



readable.on('end', () => console.log('end'));
readable.on('close', () => console.log('close'));
// setTimeout(() => console.log('over'), 1000 * 10)
readable.resume();
console.log(readable.readableFlowing)

readable.on('data', d => {
   console.log('in data: ', d);
});

readable.on('readable', () => {
   console.log('readable: ', readable.read());
});

console.log(readable.readableFlowing)
