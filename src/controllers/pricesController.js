const { initUsersModel } = require("../models/userModel")
const initProductsModel = require("../models/productModel")
const initBrandsModel = require("../models/brandsModel")

class PricesController {

  throwError(message, status = 500){
    const error = new Error(message);
    error.statusCode = status;
    throw error
  }

  //This method returned the brand of the product to me
  async getBrandAndProduct(productName){
    let brand
    const Products = await initProductsModel()
    const BrandModel = await initBrandsModel()

    const product = await Products.findOne({ nombre: productName }).lean();

    if(!product){
      this.throwError("Product not found", 404)
    }

    if(product["brand"]){
      brand = product["brand"]
    } else if(product["id_marca"]){
      const idBranch = product["id_marca"].toString()
      const brandData = await BrandModel.findOne({_id: idBranch})

      if(brandData){
        brand = brandData.name
      } else {
        brand = null
      }   
    }

    const dataReturn = {
      ...(brand  && { brand }),
      product
    }

    return { dataReturn }
  }

  //This function should return the special price to me
  async getSpecialPrices(priceList, productName){
    let priceSpecial
    let productData = { }
    const priceListClient = priceList["precios_especiales"]

    priceListClient.forEach(price => {
      const nameProduct = price.nombre_producto

      if(nameProduct == productName){
        priceSpecial = price.precio_especial_personal
      }
    });

    if(priceSpecial){
      productData.priceWithDiscount = priceSpecial

      const dataProduct = await this.getBrandAndProduct(productName)

      if( dataProduct.dataReturn["brand"] ){
        console.log("brand" ,dataProduct.dataReturn["brand"])
        productData.brandProduct = dataProduct.dataReturn["brand"]
      }
    }

    return productData
  }

  //This function should return the base price
  async getPriceBaseProduct(productName){
    let productData = { }
    const dataProduct = await this.getBrandAndProduct(productName)
    const product = dataProduct.dataReturn.product

    if(product["precioBase"]){
      productData.priceBase = product.precioBase
    } else if(product["price"]){
      productData.priceBase = product.precioBase
    } else if(product["precio_base"]){
      productData.priceBase = product.precio_base
    }

    if(dataProduct.dataReturn["brand"]){
      productData.brand = dataProduct.dataReturn["brand"]
    }

    return productData
  }

  async getPriceProduct(userId, productName) {
    let productByUser 
    let dataForClient
    const UserModel = await initUsersModel()
    try {
      productByUser = await UserModel.findOne({ _id: userId }).lean()

    } catch (error) {
      this.throwError("Invalid User Id", 400)
    }

    if(!productByUser){
      this.throwError("User Id Does Not Exist", 400)
    }

    let priceList = productByUser["metadata"]

    if(priceList){
      dataForClient = await this.getSpecialPrices(priceList, productName)
    }

    if(!dataForClient || Object.keys(dataForClient).length === 0){
      dataForClient = await this.getPriceBaseProduct(productName)
    }

    return dataForClient
  }
}

module.exports = PricesController;
