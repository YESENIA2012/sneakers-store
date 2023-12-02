const initProductsModel = require("../models/productModel")

class ProductController {
  async getProducts(){
    const Products = await initProductsModel()
    const products = await Products.find({ enStock: true })

    return products
  }

  async createProductsForTesting(dataProduct){
    const { nombre, id_marca, precioBase, enStock, } = dataProduct

    const dataNewProduct = {
      nombre, 
      id_marca, 
      precioBase, 
      enStock
    }
    
    const Products = await initProductsModel()
    const product = new Products(dataNewProduct)
    const result = await product.save()

    return result
  }
}

module.exports = ProductController