class A {
   static fo() {

   }

   static get a() {
      return A._a ?? 10;
   }

   static set a(v) {
      A._a = v;
   }


   constructor() {
      // this.a = 1;
   }
}

class B extends A { }
// B.[[Prototype]] is A，B.a 访问的是 A.a
console.log(B.a)

const b = new B;
console.log(b.a)

// 与普通对象继承的 data property 相同，对 B.a 赋值时，会创建一个 B 的 data property
B.a = 100;
console.log(A.a);
