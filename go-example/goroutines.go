package main

import (
	"main/say"
)

func main() {
	go say.Say("world")
	say.Say("hello")
}
