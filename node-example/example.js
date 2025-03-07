const { pbkdf2 } = require('node:crypto');

const start = performance.now();
let sum = 0;
for (let i = 0; i < 100000; i++) {
  sum += i
}
const delta = performance.now() - start
// console.time('start')
// console.timeEnd('start')
// process.stdout.write(`${sum}`)
process.stdout.write(`#2:${delta}`);
// pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
//   console.log('#1:', performance.now() - start);
// });
// pbkdf2('c', 'd', 100000, 512, 'sha512', () => {
//   console.log('#3:', performance.now() - start);
// });
// console.log('#4:', performance.now() - start);
