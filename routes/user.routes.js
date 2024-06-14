const express = require("express");
const userController = require("../controller/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

function getUserRoutes() {
  const router = express.Router();

  router.use(express.json());
  router.post("/login", userController.loginUser);

  router.use(authMiddleware);

  router.post("/registerUser", userController.registerUser);

  return router;
}

module.exports = getUserRoutes();
