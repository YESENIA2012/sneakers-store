const { Router } = require("express");
const productRouter = Router();
const ProductController = require("../controllers/productController")
const productController = new ProductController()

productRouter.get("/", async (req, res, next) => {

  try {
    const productSOnStock = await productController.getProducts();

    res.json(productSOnStock);
  } catch (error) {
    next(error);
  }
});


module.exports = productRouter;
