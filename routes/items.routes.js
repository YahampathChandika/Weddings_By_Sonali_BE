// const express = require("express");
// const itemsController = require("../controller/items.controller");
// const authMiddleware = require("../middleware/auth.middleware");

// function getItemsRoutes() {
//   const router = express.Router();
//   router.use(authMiddleware);

//   router.post("/createItem", itemsController.createItems);

//   return router;
// }

// module.exports = getItemsRoutes();

const express = require("express");
const itemsController = require("../controller/items.controller");
const authMiddleware = require("../middleware/auth.middleware"); // Adjust the path as needed

function getItemsRoutes() {
  const router = express.Router();

  router.use(express.json());
  router.use(authMiddleware);

  router.post("/createItem", itemsController.createItems);

  return router;
}

module.exports = getItemsRoutes();
