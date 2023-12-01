const { initUsersModel } = require("../models/userModel")
const Products = require("../models/productModel")

class PricesController {
  async getSpecialPrice(userId, productName) {
    let priceProduct
    const PricesModel = await initUsersModel()

    const productFind = await PricesModel.findOne({ _id: userId }).lean()
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

  async createPricesSpecialsList(dataClient){
    const PricesModel = await initUsersModel()
    const specialPricesList = PricesModel.create(dataClient)

    return specialPricesList
  }
}

module.exports = PricesController;
