const express = require("express");
const createItemsUsageController = require("../controller/itemUsage.controller");
const authMiddleware = require("../middleware/auth.middleware"); 

function itemUsageRoutes() {
  const router = express.Router();

  router.use(express.json());
  router.use(authMiddleware);

  router.post("/createItemsUsage", createItemsUsageController.createItemsUsage);
//   router.get("/getAllItems", itemsController.getAllItems);
//   router.get("/getItemsById/:id", itemsController.getItemsById);
//   router.delete("/deleteItem/:id", itemsController.deleteItems);
//   router.patch("/updateItem/:id", itemsController.updateItem);

  return router;
}

module.exports = itemUsageRoutes();
