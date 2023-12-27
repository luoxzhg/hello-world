import mongoose, { Schema } from "mongoose";
import mongooseLeanDefaults from 'mongoose-lean-defaults';

(async () => {
   await mongoose.connect('mongodb://VVfQGtQE4rdp:MoqUHec3TpFT4%40FGG@127.0.0.1:8635/?authSource=admin&readPreference=secondaryPreferred&directConnection=true&ssl=false')
   const schema = new Schema({
      name: { type: String, required: true },
      defaultField: { type: String, default: 'abc' }
   });
   schema.plugin(mongooseLeanDefaults.default)

   const model = mongoose.model('example', schema);
   // // const doc = await model.create({ name: '2023' });
   // // const doc2 = await model.findById(doc.id).select(['id', 'name']).lean()
   // const doc2 = await model.find().select(['id', 'name', 'defaultField']).lean({ defaults: true })
   // console.log(doc2);
   const _session = await mongoose.startSession({ defaultTransactionOptions: { readPreference: 'primary' } })
   try {
      const returnDoc = await _session.withTransaction(async (session) => {
         await model.create([{ name: '2023' }], { session });
         const docs = await model.find({ name: '2023' }).session(session).lean({ defaults: false })
         // return { success: true, data: docs}
      })
      console.log(returnDoc)
   } finally {
      await _session.endSession()
      await mongoose.disconnect()
   }
})()
