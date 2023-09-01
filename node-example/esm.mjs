import { writeFile } from "node:fs/promises";
import { Module } from "node:module";
import path from "node:path";
export function exportedFromEsm() {
   console.log('in esm module')
}

console.log(import.meta)
console.log(Module)

const tmpPath = path.join('/tmp', 'abcd/abc')
await writeFile(tmpPath, 'abcd', { })
