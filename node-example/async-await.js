
;(async() => {
   queueMicrotask(() => console.log('queue micro task'))
   console.log('before await')
   await 5;
   console.log('after await')
})()

async function abc() {
   return 5
}
