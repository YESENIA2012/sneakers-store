const { Router } = require("express");
const priceRouter = Router();
const PricesController = require("../controllers/pricesController")
const pricesController = new PricesController()

//get an event
priceRouter.get("/:user_id/:product_name", 
async (req, res, next) => {

  const userId = req.params.user_id;
  const productName = req.params.product_name

  try {
    let priceProduct = await pricesController.getSpecialPrice(userId, productName)

    res.json({ price: priceProduct });
  } catch (error) {
    next(error);
  }
});

module.exports = priceRouter;