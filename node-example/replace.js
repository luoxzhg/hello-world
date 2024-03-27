const tags = ['{A}', '{B}', '{C}']
const text = 'a\x00b\x00c\x00defg'

function recover() {
   let newText = ''
   let currentTagPos = 0
   let prevIndex = 0
   let matched = null
   const nulRe = /\0/g
   while (matched = nulRe.exec(text)) {
      console.log(matched)
      console.log(nulRe.lastIndex)
      newText = newText + text.slice(prevIndex, matched.index) + tags[currentTagPos]
      prevIndex = nulRe.lastIndex
      currentTagPos++
   }

   console.log(prevIndex)
   newText += text.slice(prevIndex)
   console.log(`new text: ${newText}`)
}


recover()
