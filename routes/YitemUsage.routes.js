const express = require("express");
const YitemUsage = require("../controller/YitemUsage.controller");
const authMiddleware = require("../middleware/auth.middleware");

function yItemUsageRoutes() {
  const router = express.Router();

  router.use(express.json());
  router.use(authMiddleware);

  router.post("/addEventItems", YitemUsage.addEventItems);
  router.post("/releaseEventItems", YitemUsage.releaseEventItems);
  router.post("/returnEventItems", YitemUsage.returnEventItems);
  router.get("/getReturnItemList/:eventId", YitemUsage.getReturnItemList);
//   router.get("/getAllUsers", YitemUsage.getAllUsers);
//   router.get("/getUserById/:id", YitemUsage.getUserById);
//   router.patch("/updateUser/:id", YitemUsage.updateUser);
//   router.delete("/deleteUser/:id", YitemUsage.deleteUser);

  return router;
}

module.exports = yItemUsageRoutes();
