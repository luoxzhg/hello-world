import mongoose, { Schema } from "mongoose";

(async() => {
   await mongoose.connect('mongodb://VVfQGtQE4rdp:MoqUHec3TpFT4%40FGG@127.0.0.1:8635/?authSource=admin&readPreference=secondaryPreferred&directConnection=true&ssl=false')
   const schema = new Schema({
      name: { type: String, required: true},
      defaultField: { type:String, default: 'abc'}
   });

   const model = mongoose.model('example', schema);
   // model.create({ name: 'test' });
   const doc = await model.find().lean().select(['name', 'defaultField']);
   console.log(doc);
   await mongoose.disconnect()
})()
