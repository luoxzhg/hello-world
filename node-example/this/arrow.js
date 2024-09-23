var num = 100;
function cl() {
   var num = 10;
   return {
      num: 0,
      getNum1() {
         console.log(this.num);
      },

      getNum2: () => {
         console.log(this.num);
      }
   };
}

const c = new cl();
c.getNum1();
c.getNum2();

const n = {
   num: 1,
   getNum: () => {
      console.log(this.num);
   }
};
n.getNum();
