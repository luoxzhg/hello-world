package main

import (
	"fmt"
)

func main() {
	arr := [10]int{
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
	}
	s := arr[9:]
	fmt.Printf("len %v, cap %v", len(s), cap(s))
	s = append(s, 11)
	fmt.Println(s)
	fmt.Println(arr)
}
