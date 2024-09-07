// class A {
//    static a = 10;
//    constructor() {
//       this.a = 1;
//    }
// }

// class B extends A { }
// console.log(B.a)

// const b = new B;
// console.log(b.a)

var num = 100
function cl() {
   var num = 10
   return {
      num: 0,
      getNum1() {
         console.log(this.num)
      },

      getNum2: () => {
         console.log(this.num)
      }
   }
}

const c = cl();
c.getNum2()

const n = {
   num: 1,
   getNum: () => {
      console.log(this.num)
   }
}
n.getNum()
