const app = require("../../app.js");
const request = require("supertest");
const expect = require("chai").expect;
const mongoose = require('mongoose');
const TestingController = require("../../src/controllers/testingController.js");
const testingController = new TestingController()



describe("Product test", () => {
  let clientAlice

  before(async() => {

    const nikeBrand = await testingController.createBrand("Nike")
    const idBrand = nikeBrand["_id"].toString()

    const firstRecord = {
      nombre: "Nike Air Max 90",
      id_marca: idBrand,
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

    await testingController.createProduct(firstRecord)
    await testingController.createProduct(secondRecord)
    await testingController.createProduct(thirdRecord)

    const dataAlice = {
      nombre: "Alice Smith", 
      nombre_producto: "Nike Air Max 90", 
      precio_especial_personal: 129.99
    }

    clientAlice = await testingController.createPricesSpecials(dataAlice)
  })

  after(async () => {
    await mongoose.disconnect();
  });

  it("GET /products/ Should return 200 and an array containing only the products that are currently in stock", 
  async () => {

    const response = await request(app).get("/products/")
    const productsInStock = response.body

    expect(response.status).to.equal(200);
    expect(productsInStock).to.be.an("array");
    expect(productsInStock.length).to.deep.equal(2)
  });

  it("GET /price/ Should return 200, a special price and product brand", async () => {
    let idClient = clientAlice["_id"].toString()
    let productName = "Nike Air Max 90"

    const response = await request(app)
    .get(`/price/${idClient}/${productName}`)
    console.log("response", response.body)

    const priceProduct = response.body

    expect(response.status).to.equal(200) ;
    expect(priceProduct).to.deep.equal({ "priceWithDiscount": 129.99, "brandProduct": "Nike" })
  })

  it("GET /price/ Should return 200 and the base price of a product for the client", async () => {

    let idClient = clientAlice["_id"].toString()

    let productName = "SuperJordan"

    const response = await request(app)
    .get(`/price/${idClient}/${productName}`)

    const priceProduct = response.body

    expect(response.status).to.equal(200) ;
    expect(priceProduct).to.deep.equal({ priceBase: 100 })
  })

  it("GET /price/ Should return 400 and error if user id is invalid", async () => {
    let idClient = "656bbd987ac3e67878f6aa67"
    let productName = "SuperJordan"

    const response = await request(app)
    .get(`/price/${idClient}/${productName}`)

    const priceProduct = response.body

    expect(response.status).to.equal(400) ;
    expect(priceProduct).to.deep.equal({ error: "User Id Does Not Exist" })
  })

  it("GET /price/ Should return 400 and error if user id is invalid", async () => {
    let idClient = "656bbd987ac3e67878f6aa698"
    let productName = "SuperJordan"

    const response = await request(app)
    .get(`/price/${idClient}/${productName}`)

    const priceProduct = response.body

    expect(response.status).to.equal(400) ;
    expect(priceProduct).to.deep.equal({ error: "Invalid User Id" })
  })

  it("GET /price/ Should return 200 and the base price when metadata property not exist", async () => {
    const dataHenry = {
      "nombre" : "Henry Wilson"
    }

    let clientHenry = await testingController.createPricesSpecials(dataHenry)
    let idClient = clientHenry["_id"].toString()
    let productName = "Zapatillas  formales - pumas"

    const response = await request(app)
    .get(`/price/${idClient}/${productName}`)

    const priceProduct = response.body

    expect(response.status).to.equal(200) ;
    expect(priceProduct).to.deep.equal({ priceBase: 99.98 })
  })

  it("GET /price/ Should return 404 and error if product is not found", async () => {
    const productName = "New Balance FuelCell Rebel"
    const idClient = clientAlice["_id"].toString()

    const response = await request(app)
    .get(`/price/${idClient}/${productName}`)

    const priceProduct = response.body

    expect(response.status).to.equal(404) ;
    expect(priceProduct).to.deep.equal({ error: "Product not found" })
  })

});