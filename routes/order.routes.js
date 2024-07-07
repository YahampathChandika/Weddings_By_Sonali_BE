const express = require("express");
const orderController = require("../controller/order.controller");
const authMiddleware = require("../middleware/auth.middleware"); 

function orderRoutes() {
  const router = express.Router();

  router.use(express.json());
  router.use(authMiddleware);

  router.post("/crateOrder", orderController.createOrder);
  router.get("/getAllOrders", orderController.getAllOrders);
  router.get("/getOrderById/:id", orderController.getOrderById);
//   router.delete("/deleteItem/:id", createItemsUsageController.deleteItems);
//   router.patch("/updateItem/:id", createItemsUsageController.updateItem);

  return router;
}

module.exports = orderRoutes();
