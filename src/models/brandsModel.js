const mongoose = require("mongoose")
const { Schema } = mongoose;

const modelSchema = new Schema({
  name: String
})

const BrandModel = mongoose.model('brands', modelSchema);

module.exports = BrandModel;