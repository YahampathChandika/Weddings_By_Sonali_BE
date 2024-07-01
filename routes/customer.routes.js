const express = require("express");
const customerController = require("../controller/customer.controller");
const authMiddleware = require("../middleware/auth.middleware");

function getCustomerRoutes() {
    const router = express.Router();

    router.use(express.json());
    router.use(authMiddleware);

    router.post("/addCustomer", customerController.registerCustomer);
    router.get("/getAllCustomers", customerController.getAllCustomers);
    router.get("/getCustomerById/:id", customerController.getCustomerById);
    router.patch("/updateCustomer/:id", customerController.updateCustomer);
    router.delete("/deleteCustomer/:id", customerController.deleteCustomer);

    return router;
}

module.exports = getCustomerRoutes();
