import { once } from "node:events";
import { Writable } from "node:stream";

const writable = new Writable({
   highWaterMark: 10,
   decodeStrings: false,
   write(chunk, encoding, callback) {
      console.log(chunk.toString('ascii'));
      setTimeout(() => callback(), 1000);
   },
   writev(chunks, callback) {
      console.log(chunks)
      setImmediate(() => callback());
   }
});

writable.on('drain', () => {
   console.log('drain');
   console.log(writable.writableLength);
   console.log(writable.writableFinished);
   console.log(writable.writableCorked);
});

writable.prependListener('finish', () => {
   console.log('finish event', writable.writableFinished);
});

writable.on('close', () => {
   console.log('close event');
});

const timer = setInterval(async() => {
   if (!writable.writable) {
      clearInterval(timer);
      return
   }
   if (!writable.write('hello', 'utf8')) {
      console.log('buffer full');
      await once(writable, 'drain');
      console.log('buffer drained');
   }
}, 100);

setTimeout(() => {
   // clearInterval(timer);
   console.log(writable.writable);
   writable.end(() => console.log('end callback'));
   console.log(writable.writableFinished);
}, 1000 * 2);
