const { getInstance } = require("../../dbs/setup")

async function initProductsModel(){
  const mongoose = await getInstance();
  const model = mongoose.model('products', {});

  return model
}



module.exports = initProductsModel;