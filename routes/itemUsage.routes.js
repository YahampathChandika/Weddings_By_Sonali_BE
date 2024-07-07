const express = require("express");
const createItemsUsageController = require("../controller/itemUsage.controller");
const authMiddleware = require("../middleware/auth.middleware"); 

function itemUsageRoutes() {
  const router = express.Router();

  router.use(express.json());
  router.use(authMiddleware);

  router.post("/createUsageItems", createItemsUsageController.createItemsUsage);
  router.get("/getAllSelectItems", createItemsUsageController.getAllSelectItems);
  router.get("/getSelectItemsById/:id", createItemsUsageController.getSelectItemUsageById);
//   router.delete("/deleteItem/:id", createItemsUsageController.deleteItems);
//   router.patch("/updateItem/:id", createItemsUsageController.updateItem);

  return router;
}

module.exports = itemUsageRoutes();
