const mongoose = require("mongoose")
const { Schema } = mongoose;

const modelSchema = new Schema({
  nombre: String,
  id_marca: Schema.Types.ObjectId,
  precioBase: Number,
  enStock: Boolean,
})

const ProductModel = mongoose.model('products', modelSchema);

module.exports = ProductModel;