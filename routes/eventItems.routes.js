const express = require("express");
const eventItems = require("../controller/eventItems.controller");
const authMiddleware = require("../middleware/auth.middleware");

function eventItemsRoutes() {
  const router = express.Router();

  router.use(express.json());
  router.use(authMiddleware);

  router.post("/addEventItems", eventItems.addEventItems);
  router.post("/releaseEventItems", eventItems.releaseEventItems);
  router.post("/returnEventItems", eventItems.returnEventItems);
  router.get("/getReturnItemsList/:eventId", eventItems.getReturnItemList);
  router.get('/getEventItemsById/:eventId', eventItems.getEventItemsById);

//   router.get("/getAllUsers", YitemUsage.getAllUsers);
//   router.get("/getUserById/:id", YitemUsage.getUserById);
//   router.patch("/updateUser/:id", YitemUsage.updateUser);
//   router.delete("/deleteUser/:id", YitemUsage.deleteUser);

  return router;
}

module.exports = eventItemsRoutes();
