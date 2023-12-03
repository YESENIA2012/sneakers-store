const ProductModel = require("../models/productModel")

class ProductController {
  async getProducts(){
    const products = await ProductModel.find({ enStock: true })

    return products
  }

}

module.exports = ProductController