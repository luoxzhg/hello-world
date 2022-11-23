label1: while (1) {
   console.log('outer loop')
   let count = 0
   while (1) {
      console.log('inner loop')
      if (++count >= 1) {
         break label1
         // break
      }
   }
}

console.log('break loop')
