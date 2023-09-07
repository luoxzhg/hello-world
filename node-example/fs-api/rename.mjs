import { rename } from "node:fs/promises";

(async() => {
   await rename('source.txt', 'target.txt')
})()
