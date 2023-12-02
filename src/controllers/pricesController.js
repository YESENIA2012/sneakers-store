const { initUsersModel } = require("../models/userModel")
const initProductsModel = require("../models/productModel")

class PricesController {
  async getSpecialPrice(userId, productName) {
    let priceProduct
    const UserModel = await initUsersModel()

    const productFind = await UserModel.findOne({ _id: userId }).lean()
    const priceList = productFind["metadata"]

    if(priceList){
      const priceListClient = priceList["precios_especiales"]
      priceListClient.forEach(price => {
        const nameProduct = price.nombre_producto

        if(nameProduct == productName){
          return priceProduct = price.precio_especial_personal
        }
      });
    }

    if(!priceProduct){
      const Products = await initProductsModel()
      const product = await Products.findOne({ nombre: productName }).lean();

      if(!product){
        console.log("priceProduct", priceProduct)
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error
      }

      priceProduct = product.precioBase
    }

    return priceProduct
  }

  async createPricesSpecialsListForTesting(dataClient){
    const { nombre, nombre_producto, precio_especial_personal } = dataClient

    const dataClientSpecialProduct = {
      nombre,
    }
    
    if(nombre_producto || precio_especial_personal){

      dataClientSpecialProduct.metadata = {
        precios_especiales: [
          {
            nombre_producto,
            precio_especial_personal,
          },
        ],
      };
    }

    const UserModel = await initUsersModel()
    const specialPricesList = new UserModel(dataClientSpecialProduct)
    const result = await specialPricesList.save()

    return result
  }
}

module.exports = PricesController;
