import createExpressApp, { Router as createRouter } from 'express';

const app = createExpressApp()
const router = createRouter()

app.router.all('/', (req, res) => {
   console.log('in all')
   res.sendStatus(200)
})

app.use('/', (req, res, next) => {
   console.log('in middleware')
   next()
})

app.listen(3000, function() {
   console.log(arguments)
})
