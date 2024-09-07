import mongoose, { Schema } from "mongoose";
// import mongooseLeanDefaults from 'mongoose-lean-defaults';

(async () => {
   await mongoose.connect('mongodb://VVfQGtQE4rdp:MoqUHec3TpFT4%40FGG@127.0.0.1:8635/?authSource=admin&readPreference=secondaryPreferred&directConnection=true&ssl=false');
   const schema = new Schema({
      text: { type: String, enum: ['a', 'b'] }
   });
   // schema.plugin(mongooseLeanDefaults.default);

   const model = mongoose.model('example', schema);
   const doc = await model.create({ text: 'a' });
   try {
      doc.text = 'b';
      await doc.save();
      throw new Error('test')
   } finally {
      try {
         doc.text = 'c';
         await doc.save();
      } catch(error) {
         console.log(error);
      }
   }
})();
