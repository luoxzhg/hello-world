class E {
    count = 0

    displayCount() {
        console.log(this?.count)
    }

    displayCountArrow = () => {
        console.log(this.count)
    }
}

const e = new E()
e.count = 10
const f1 = e.displayCount
f1()
const f2 = e.displayCountArrow
f2()