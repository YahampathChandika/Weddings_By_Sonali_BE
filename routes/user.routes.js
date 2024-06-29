const express = require("express");
const userController = require("../controller/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

function getUserRoutes() {
  const router = express.Router();

  router.use(express.json());
  router.post("/login", userController.loginUser);

  router.use(authMiddleware);

  router.post("/registerUser", userController.registerUser);
  router.get("/getUserRoles", userController.getUserRoles);
  router.get("/getAllUsers", userController.getAllUsers);
  router.get("/getUserById/:id", userController.getUserById);
  router.patch("/updateUser/:id", userController.updateUser);
  router.delete("/deleteUser/:id", userController.deleteUser);
  router.get("/getSignedUser", userController.getSignedUser);

  return router;
}

module.exports = getUserRoutes();
