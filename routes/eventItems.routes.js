const express = require("express");
const eventItems = require("../controller/eventItems.controller");
const authMiddleware = require("../middleware/auth.middleware");

function eventItemsRoutes() {
  const router = express.Router();

  router.use(express.json());
  router.use(authMiddleware);

  
  router.post("/addEventItems", eventItems.addEventItems);
  router.get('/getEventItemsById/:eventId', eventItems.getEventItemsById);
  router.get("/getReleaseItemList/:eventId", eventItems.getReleaseItemList);
  router.post("/releaseEventItems", eventItems.releaseEventItems);
  router.get("/getReturnItemsList/:eventId", eventItems.getReturnItemList);
  router.post("/returnEventItems", eventItems.returnEventItems);
  router.get('/getWashlist/:eventId', eventItems.getWashList);
  router.post('/markWashed', eventItems.markItemsAsWashed);

  return router;
}

module.exports = eventItemsRoutes();
