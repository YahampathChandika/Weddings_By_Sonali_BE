const express = require("express");
const itemsController = require("../controller/items.controller");
const authMiddleware = require("../middleware/auth.middleware"); 

function getItemsRoutes() {
  const router = express.Router();

  router.use(express.json());
  router.use(authMiddleware);

  router.post("/createItem", itemsController.createItems);
  router.get("/getAllItems", itemsController.getAllItems);
  router.get("/getItemsById/:id", itemsController.getItemsById);
  router.delete("/deleteItem/:id", itemsController.deleteItems);
  router.patch("/updateItem/:id", itemsController.updateItem);

  return router;
}

module.exports = getItemsRoutes();
