class A {
    getA() {
        return 1
    }
}

class B {
    constructor() {
    }
    a = new A();
    a2 = this.a.getA()
}

const a = new A()
const b = new B(a)
console.log(b.a2)