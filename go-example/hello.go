package main

import (
	"fmt"
)

const (
	Big = 1 << 100
	Small = Big >> 99
)
func main() {
	// big, small := Big, Small

	// fmt.Printf("big type is %T, small type is %T", Big ,Small)
	fmt.Printf("%T\n", Small)
}

func add(x, y float64) float64 {
	return x + y
}