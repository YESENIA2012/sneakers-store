const initProductsModel = require("../models/productModel")

class ProductController {
  async getProducts(){
    const Products = await initProductsModel()
    const products = await Products.find({ enStock: true })

    return products
  }
}

module.exports = ProductController