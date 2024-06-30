const express = require("express");
const itemsController = require("../controller/items.controller");

function getItemsRoutes() {
  const router = express.Router();

  router.post("/createitems", itemsController.createItems);

  return router;
}

module.exports = getItemsRoutes;
