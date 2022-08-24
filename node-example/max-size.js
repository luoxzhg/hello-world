// on 16GB machine
const v8 = require('node:v8')

const o = v8.getHeapStatistics()
console.log(o)
console.log(`heap size limit: ${o.heap_size_limit/1024/1024}MB`)
console.log(`total heap size: ${o.total_heap_size/1024/1024}MB`)
console.log(`total physical size: ${o.total_physical_size/1024/1024}MB`)
console.log(`total available size: ${o.total_available_size/1024/1024}MB`)




// //
// // Small program to test the maximum amount of allocations in multiple blocks.
// // This script searches for the largest allocation amount.
// //

// //
// // Allocate a certain size to test if it can be done.
// //
// function alloc (size) {
//    const numbers = size / 8;
//    const arr = []
//    arr.length = numbers; // Simulate allocation of 'size' bytes.
//    for (let i = 0; i < numbers; i++) {
//        arr[i] = i;
//    }
//    return arr;
// };

// //
// // Keep allocations referenced so they aren't garbage collected.
// //
// const allocations = [];

// //
// // Allocate successively larger sizes, doubling each time until we hit the limit.
// //
// function allocToMax () {

//    console.log("Start");

//    const field = 'heapUsed';
//    const mu = process.memoryUsage();
//    console.log(mu);
//    const gbStart = mu[field] / 1024 / 1024;
//    console.log(`Start ${Math.round(gbStart)} MB`);

//    let allocationStep = 1024 * 1024;

//    while (true) {
//        // Allocate memory.
//        const allocation = alloc(allocationStep);

//        // Allocate and keep a reference so the allocated memory isn't garbage collected.
//        allocations.push(allocation);

//        // Check how much memory is now allocated.
//        const mu = process.memoryUsage();
//        const mbNow = mu[field] / 1024 / 1024;
//        //console.log(`Total allocated       ${Math.round(mbNow * 100) / 100} GB`);
//        console.log(`Allocated since start ${Math.round((mbNow - gbStart))} MB`);

//        // Infinite loop, never get here.
//    }

//    // Infinite loop, never get here.
// };

// allocToMax();

// // Infinite loop, never get here.