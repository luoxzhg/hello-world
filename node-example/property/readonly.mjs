const proto = Object.create(null);
Object.defineProperty(proto, 'readonly', {
   configurable: false,
   enumerable: false,
   writable: true,
   value: 10,
});

const o = Object.create(proto);
console.log(o.readonly);
o.readonly = 0;
console.log(o.readonly);
console.log(proto.readonly);
