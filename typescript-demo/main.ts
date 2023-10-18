type ErrorCode = Exclude<number, 0>;
type T = 0 extends number ? 0 : number;
type U = number extends 0 ? number : 0;
type Code<T> = T extends 0 ? 0 : T;
type code1 =  Code<1>
type NArray = {
   length: number;
   name: string;
   [index:number]: boolean;
}

interface IBase {
   a: string;
}
interface IDrived extends IBase {
   method(): string;
}

function f1(a: IBase) { a.a }
function f2(b: IDrived) { b.method() }

let f: (IDrived)=>void = f1;   // right
let g: (IBase)=>void = f2;   // wrong!!!
f({a: 'a'})
g({a: 'a'}) // TypeError: b.method is not a function
