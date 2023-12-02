const { Schema } = require("mongoose");
const { getInstance } = require("../../dbs/setup")

const modelSchema = new Schema({
  nombre: String,
  id_marca: Schema.Types.ObjectId,
  precioBase: Number,
  enStock: Boolean,
})

async function initProductsModel(){
  const mongoose = await getInstance();
  const model = mongoose.model('products', modelSchema);

  return model
}



module.exports = initProductsModel;