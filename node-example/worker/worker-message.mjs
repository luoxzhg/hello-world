import { Worker, isMainThread, parentPort, threadId } from 'node:worker_threads';

if (isMainThread) {
   const worker = new Worker(import.meta.url);
   worker.on('message', data => {

   })
} else {

}
