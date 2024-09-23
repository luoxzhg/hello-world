class A {
   static a = 10;
   constructor() {
      this.a = 1;
   }
}

class B extends A { }
console.log(B.a)

const b = new B;
console.log(b.a)
