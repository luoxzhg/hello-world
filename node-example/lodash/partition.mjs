import _partition from "lodash.partition";

(async() => {
   const arr = [
      {name: 'a', flag: 0},
      {name: 'b', flag: 0},
      {name: 'c', flag: 1},
      {name: 'd', flag: 0},
   ]

   const r = _partition(arr, value => value.flag)
   console.log(r)
})()
