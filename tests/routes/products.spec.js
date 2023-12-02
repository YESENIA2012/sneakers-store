const app = require("../../app.js");
const request = require("supertest");
const expect = require("chai").expect;
const mongoose = require('mongoose');
const ProductController = require("../../src/controllers/productController.js");
const productController = new ProductController()
const PricesController = require("../../src/controllers/pricesController.js");
const pricesController = new PricesController()

describe("Product test", () => {
  let clientAlice

  before(async() => {
    const firstRecord = {
      nombre: "Nike Air Max 90",
      id_marca: "649d1816f8253a0a6a5f218e",
      precioBase: 150.99,
      enStock: true,
    };

    const secondRecord = {
      nombre: "SuperJordan",
      id_marca: "649d17f922ea778d73f7810e",
      precioBase: 100,
      enStock: false,
    }

    const thirdRecord = {
      nombre: "Zapatillas  formales - pumas",
      id_marca: "649d181df8253a0a6a5f2191",
      precioBase: 99.98,
      enStock: true,
    }

    await productController.createProductsForTesting(firstRecord)
    await productController.createProductsForTesting(secondRecord)
    await productController.createProductsForTesting(thirdRecord)

    const dataAlice = {
      nombre: "Alice Smith", 
      nombre_producto: "Nike Air Max 90", 
      precio_especial_personal: 129.99
    }

    clientAlice = await pricesController.createPricesSpecialsListForTesting(dataAlice)
  })

  after(async () => {
    await mongoose.disconnect();
  });

  it("GET / Should return 200 and an array containing only the products that are currently in stock", 
  async () => {

    const response = await request(app).get("/products/")
    const productsInStock = response.body

    expect(response.status).to.equal(200);
    expect(productsInStock).to.be.an("array");
    expect(productsInStock.length).to.deep.equal(2)
  });

  it("GET / Should return 200 and a special price for a client", async () => {
    let idClient = clientAlice["_id"].toString()
    let productName = "Nike Air Max 90"

    const response = await request(app)
    .get(`/price/${idClient}/${productName}`)

    const priceProduct = response.body

    expect(response.status).to.equal(200) ;
    expect(priceProduct).to.deep.equal({ price: 129.99 })
  })

  it("GET / Should return 200 and the base price of a product for the client", async () => {
    let idClient = clientAlice["_id"].toString()
    let productName = "SuperJordan"

    const response = await request(app)
    .get(`/price/${idClient}/${productName}`)

    const priceProduct = response.body

    expect(response.status).to.equal(200) ;
    expect(priceProduct).to.deep.equal({ price: 100 })
  })

  it("GET / Should return 200 and the base price of a product for the client", async () => {
    const idClient = clientAlice["_id"].toString()
    const productName = "SuperJordan"

    const response = await request(app)
    .get(`/price/${idClient}/${productName}`)

    const priceProduct = response.body

    expect(response.status).to.equal(200) ;
    expect(priceProduct).to.deep.equal({ price: 100 })
  })

  it("GET / Should return 200 and the base price when metadata property not exist", async () => {
    const dataHenry = {
      "nombre" : "Henry Wilson"
    }

    let clientHenry = await pricesController.createPricesSpecialsListForTesting(dataHenry)
    let idClient = clientHenry["_id"].toString()
    let productName = "Zapatillas  formales - pumas"

    const response = await request(app)
    .get(`/price/${idClient}/${productName}`)

    const priceProduct = response.body

    expect(response.status).to.equal(200) ;
    expect(priceProduct).to.deep.equal({ price: 99.98 })
  })

  it("GET / Should return 404 and error if product is not found", async () => {
    const productName = "New Balance FuelCell Rebel"
    const idClient = clientAlice["_id"].toString()

    const response = await request(app)
    .get(`/price/${idClient}/${productName}`)

    const priceProduct = response.body

    expect(response.status).to.equal(404) ;
    expect(priceProduct).to.deep.equal({ error: "Product not found" })
  })

});