const express = require("express");

const userRoutes = require("./user.routes");
const itemRoutes = require("./items.routes");
const customerRoutes = require("./customer.routes");
function routes() {
  const router = express.Router();

  router.use("/user", userRoutes);
  router.use("/item", itemRoutes);
  router.use("/customer", customerRoutes);

  return router;
}

module.exports = routes();
