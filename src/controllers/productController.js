const initProductsModel = require("../models/productModel")

class ProductController {
  async getProducts(){
    const Products = await initProductsModel()
    const products = await Products.find({ enStock: true })

    return products
  }

  async createProductsForTesting(dataProduct){
    const Products = await initProductsModel()
    const product = Products.create(dataProduct)

    return product
  }
}

module.exports = ProductController