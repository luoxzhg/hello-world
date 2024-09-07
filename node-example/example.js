const { pbkdf2 } = require('node:crypto');

const start = Date.now();
pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('#1:', Date.now() - start);
});

pbkdf2('c', 'd', 100000, 512, 'sha512', () => {
  console.log('#2:', Date.now() - start);
});
