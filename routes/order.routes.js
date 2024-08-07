const express = require("express");
const orderController = require("../controller/order.controller");
const authMiddleware = require("../middleware/auth.middleware"); 

function orderRoutes() {
  const router = express.Router();

  router.use(express.json());
  router.use(authMiddleware);

  router.post("/addNewOrder", orderController.createOrder);
  router.get("/getAllOrders", orderController.getAllOrders);
  router.get("/getOrderById/:id", orderController.getOrderById);
  router.get("/getOrdersByState/:state", orderController.getOrdersByState);
  router.get('/getOrderMatrices', orderController.getOrderMatrices);
  router.delete('/deleteOrder/:orderId', orderController.deleteOrder);

//   router.patch("/updateItem/:id", createItemsUsageController.updateItem);

  return router;
}

module.exports = orderRoutes();
