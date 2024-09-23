class Strict {
   static test() {
      console.log('this =>', this);
   }
}

const test = Strict.test;
test();  // undefined
