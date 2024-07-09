const express = require("express");
const ItemsUsageController = require("../controller/itemUsage.controller");
const authMiddleware = require("../middleware/auth.middleware"); 

function itemUsageRoutes() {
  const router = express.Router();

  router.use(express.json());
  router.use(authMiddleware);

  router.post("/createUsageItems", ItemsUsageController.createItemsUsage);
  router.get("/getAllSelectItems", ItemsUsageController.getAllSelectItems);
  router.get("/getSelectItemsById/:id", ItemsUsageController.getSelectItemUsageById);
  router.delete("/deleteSelectItem/:id", ItemsUsageController.deleteSelectItem);
  router.patch("/updateSelectItem/:id", ItemsUsageController.updateSelectItem);
  router.post("/isSelectItem", ItemsUsageController.isSelectItem);
  router.post("/reternItems", ItemsUsageController.returnItems);


  return router;
}

module.exports = itemUsageRoutes();
