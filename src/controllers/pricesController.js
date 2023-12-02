const { initUsersModel } = require("../models/userModel")
const initProductsModel = require("../models/productModel")

class PricesController {

  throwError(message, status = 500){
    const error = new Error(`${message}`);
    error.statusCode = `${status}`;
    throw error
  }

  async getSpecialPrice(userId, productName) {
    let priceProduct
    const UserModel = await initUsersModel()
    let productByUser 

    try {
      productByUser = await UserModel.findOne({ _id: userId }).lean()
    } catch (error) {
      this.throwError("Invalid User Id", 400)
    }

    if(!productByUser){
      this.throwError("User not found", 404)
    }

    const priceList = productByUser["metadata"]

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
        this.throwError("Product not found", 404)
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
