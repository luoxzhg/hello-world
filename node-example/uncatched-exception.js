process.on('uncaughtException', (error, origin) => {
   console.log('origin: ', origin)
   console.log(error)
})

process.on('uncaughtException', (error, origin) => {
   console.log('origin 2: ', origin)
   console.log(error)
})


;(async() => {
   throw new Error('uncatched')
})()
