// class 定义中只能包含构造函数、方法、访问器或属性，静态方法，静态属性。
// 若包含其他内容会报语法错误。
class A {
   // A constructor, method, accessor, or property was expected.
   // let a = 1;
   static a = 10;
   constructor() {
      this.a = 1;
      // 静态属性和静态方法必须使用类名调用，不能使用 this 调用，也不能使用实例调用，也不能裸属性名访问。
      // 裸属性名访问的是全局变量或模块变量，实质上是 class定义所在作用域内声明的变量。
      console.log(A.a);
   }
}

const a = new A;
