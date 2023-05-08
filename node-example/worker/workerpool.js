const workpool = require('workerpool')

const pool = workpool.pool({workerType: 'thread'})

function add(a, b) {
    while(true) {
        continue
    }
    // return a + b
}


pool.exec(add, [1, 2]).timeout(1000).then(result => {
    console.log( result )
}).catch(error => {
    console.error( error )
    throw error
}).catch( error => console.log('catch throw'))

// (async()=> {
//     try {
//         const result = await pool.exec(add, [1, 2]).timeout(1000)
//         console.log( result )
//     } catch (error) {
//         console.error( error )
//     }

// })()

setTimeout(()=>{ process.exit(0)}, 5000)