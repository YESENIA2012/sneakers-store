const { Router } = require("express");
const productRouter = require("./product.js");
const priceRouter = require("./price.js")

const mainRouter = Router();

mainRouter.use("/products", productRouter);
mainRouter.use("/price", priceRouter)


module.exports = mainRouter;
