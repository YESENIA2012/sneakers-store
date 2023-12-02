const { initUsersModel } = require("../models/userModel")
const initProductsModel = require("../models/productModel")

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
      const Products = await initProductsModel()
      const product = await Products.findOne({ nombre: productName }).lean();
      priceProduct = product.precioBase
    }

    return priceProduct
  }

  async createPricesSpecialsList(dataClient){
    const { nombre, nombre_producto, precio_especial_personal } = dataClient
    
    const dataClientSpecialProduct = {
      nombre,
      metadata: {
        precios_especiales: [
          {
            nombre_producto,
            precio_especial_personal
          }
        ],
      }
    }

    const PricesModel = await initUsersModel()
    const specialPricesList = new PricesModel(dataClientSpecialProduct)
    const result = await specialPricesList.save()

    return result

    //voy haciendo el endpoint para consutrir la lista con los precios especiales del cliente
    //acuerdece que si no ecnuentra en uno le toca ir a buscar en otro endpoint
  }
}

module.exports = PricesController;
