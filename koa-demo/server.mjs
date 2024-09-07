import Koa from "koa";

const app = new Koa({
   asyncLocalStorage: true
});

app.use(async(ctx, next) => {
   console.log('first before')
   if (ctx === ctx.app.currentContext) {
      console.log('ctx true')
   }
   await next()
   console.log('first after')
})

app.use(async(ctx, next) => {
   console.log('second before')
   await next()
   console.log('second after')
})

// app.use(async() => {
//    throw new Error('abcd')
// })

app.listen(3000)
