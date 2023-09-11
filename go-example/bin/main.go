package main

import (
	"fmt"
	"log"

	abcd "example.com/greetings"
)

func main() {
	log.SetPrefix("greetings: ")
	log.SetFlags(0)

	names := []string{"Gladys", "Samantha", "Darrin"}
	fmt.Println(len(names))
	fmt.Println(cap(names))
	names = names[:3]
	messages, err := abcd.Hellos(names)
	if err != nil {
		log.Fatal(err)
	}
	s := arr[9:]
	fmt.Printf("len %v, cap %v", len(s), cap(s))
	s = append(s, 11)
	fmt.Println(s)
	fmt.Println(arr)
}
