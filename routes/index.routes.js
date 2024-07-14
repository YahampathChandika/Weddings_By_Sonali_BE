const express = require("express");

const userRoutes = require("./user.routes");
const itemRoutes = require("./items.routes");
const itemUsageRoutes = require("./itemUsage.routes");
const customerRoutes = require("./customer.routes");
// const eventRoutes = require("./event.routes")
const orderRoutes = require("./order.routes");
const YitemUsageRoutes = require("./YitemUsage.routes");
function routes() {
  const router = express.Router();

  router.use("/user", userRoutes);
  router.use("/item", itemRoutes);
  router.use("/customer", customerRoutes);
  router.use("/itemUsage", itemUsageRoutes);
  router.use("/eventItems", YitemUsageRoutes);
  // router.use("/event", eventRoutes);
  router.use("/order", orderRoutes);

  return router;
}

module.exports = routes();
