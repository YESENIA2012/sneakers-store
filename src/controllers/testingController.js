const initProductsModel = require("../models/productModel")
const { initUsersModel } = require("../models/userModel")
const initBrandsModel = require("../models/brandsModel")

class TestingController {
  async createProduct(dataProduct){
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

  async createPricesSpecials(dataClient){
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
  
  async createBrand(name){

    const data = { name }
    const BrandModel = await initBrandsModel()
    const specialPricesList = new BrandModel(data)
    const result = await specialPricesList.save()

    return result
  }

}

module.exports = TestingController