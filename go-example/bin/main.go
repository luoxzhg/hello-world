package main

type IBase interface {
	a(IBase) IBase
}

type IDrived interface {
	IBase
	b(IDrived) IDrived
}

func f1(a IBase) IBase {
	println("f1")
	return a
}

func f2(a IDrived) IDrived {
	println("f2")
	return a
}

func main() {
	var p1 func(IBase) IBase = f1
	var p2 func(IDrived) IDrived = f2
}
