const app = require("../../app.js");
const request = require("supertest");
const expect = require("chai").expect;
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ProductController = require("../../src/controllers/productController.js");
const productController = new ProductController()
const PricesController = require("../../src/controllers/pricesController.js");
const pricesController = new PricesController()

const {
  mockedErrorParamsEmpty,
} = require("../mocks/event.mock.js");

describe("Product test", () => {

  after(async () => {
    await mongoose.disconnect();
  });

it("GET / Should return 200 and an array containing only the products that are currently in stock", 
async () => {
    const firstRecord = {
      nombre: "Zapatillas formales - adidas",
      id_marca: "649d1816f8253a0a6a5f218e",
      precioBase: 99.98,
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

    const response = await request(app).get("/products/")
    const productsInStock = response.body

    expect(response.status).to.equal(200);
    expect(productsInStock).to.be.an("array");
    expect(productsInStock.length).to.deep.equal(2)
  });
});