
(async() => {
   const m = await import('./esm.mjs')
   m.exportedFromEsm()
})()
