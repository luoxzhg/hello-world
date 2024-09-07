const proto = {
   get name() {
      return this._name;
   },

   set name(value) {
      this._name = value;
   }
}

const value = Object.create(proto);
value.name = 'John';
console.log(value); // John

console.log(Object.assign(Object.create(null), value))
console.log(typeof Object.create(null)); // object
console.log(Object.hasOwn(proto, 'name'));
console.log(Object.hasOwn(value, 'name'));
