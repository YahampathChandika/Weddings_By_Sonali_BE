const express = require("express");
const eventController = require("../controller/event.controller");
const authMiddleware = require("../middleware/auth.middleware");

function getEventRoutes() {
    const router = express.Router();

    router.use(express.json());
    router.use(authMiddleware);

    router.post("/addEvent", eventController.registerEvent);
    // router.get("/getAllEvents", eventController.getAllEvents);
    // router.get("/getEventById/:id", eventController.getEventById);
    // router.patch("/updateEvent/:id", eventController.updateEvent);
    // router.delete("/deleteEvent/:id", eventController.deleteEvent);

    return router;
}

module.exports = getEventRoutes();
