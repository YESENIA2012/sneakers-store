const { Schema } = require("mongoose");
const { getInstance } = require("../../dbs/setup")

const modelSchema = new Schema({
  name: String
})
  
async function initBrandsModel(){
  const mongoose = await getInstance();
  const model = mongoose.model('brands', modelSchema);

  return model
}



module.exports = initBrandsModel;