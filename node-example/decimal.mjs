import Decimal from 'decimal.js';

(async() =>{
   const unit = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10]
   for (const f of unit) {
      const n = Decimal.mul(new Decimal(f), 33)
      console.log(f)
      console.log(n.toJSON())
   }
})()
