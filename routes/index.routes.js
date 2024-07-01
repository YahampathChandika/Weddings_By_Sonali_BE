const express = require("express");

const userRoutes = require("./user.routes");
const itemRoutes = require("./items.routes");
const itemUsageRoutes = require("./itemUsage.routes");
// const patientRoutes = require("./patients.routes");
// const vitalsRoutes = require("./vitals.routes");
// const bedsRoutes = require("./beds.routes");

function routes() {
  const router = express.Router();

  router.use("/user", userRoutes);
  router.use("/item", itemRoutes);
  router.use("/itemUsage", itemUsageRoutes);
  // router.use("/patient", patientRoutes);
  // router.use("/vitals", vitalsRoutes);
  // router.use("/bed", bedsRoutes);

  return router;
}

module.exports = routes();
