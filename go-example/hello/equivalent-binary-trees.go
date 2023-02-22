package main

import (
	"fmt"

	"golang.org/x/tour/tree"
)

// Walk walks the tree t sending all values
// from the tree to the channel ch.
func Walk(t *tree.Tree, ch chan int) {
	if t.Left != nil {
		Walk(t.Left, ch)
	}

	ch <- t.Value

	if t.Right != nil {
		Walk(t.Right, ch)
	}

}

// Same determines whether the trees
// t1 and t2 contain the same values.
func Same(t1, t2 *tree.Tree) bool {
	a1 := make([]int, 0, 10)
	a2 := make([]int, 0, 10)
	ch1 := make(chan int)
	ch2 := make(chan int)
	go func() {
		Walk(t1, ch1)
		close(ch1)
	}()
	go func() {
		Walk(t2, ch2)
		close(ch2)
	}()

	for i := range ch1 {
		a1 = append(a1, i)
	}
	for i := range ch2 {
		a2 = append(a2, i)
	}
	fmt.Println(a1)
	fmt.Println(a2)

	for i := 0; i < 10; i += 1 {
		if a1[i] != a2[i] {
			return false
		}
	}
	return true
}

// func main() {
// 	a := Same(tree.New(1), tree.New(1))
// 	b := Same(tree.New(1), tree.New(2))
// 	fmt.Println(a, b)
// }
