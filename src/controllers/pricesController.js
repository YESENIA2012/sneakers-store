const { initUsersModel } = require("../models/pricesUserModel")
const Products = require("../models/productModel")

class PricesController {
  async getSpecialPrice(userId, productName) {
    let priceProduct
    const pricesModel = await initUsersModel()

    const productFind = await pricesModel.findOne({ _id: userId }).lean()
    const priceList = productFind["metadata"]["precios_especiales"]

    if(priceList){
      priceList.forEach(price => {
        const nameProduct = price.nombre_producto

        if(nameProduct == productName){
          return priceProduct = price.precio_especial_personal
        }
      });
    }

    if(!priceProduct){
      const product = await Products.findOne({ nombre: productName }).lean();
      priceProduct = product.precioBase
    }

    return priceProduct
  }
}

module.exports = PricesController;
