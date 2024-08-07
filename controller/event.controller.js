const eventService = require("../service/event.service");

async function registerEvent(req, res) {
  try {
    const userRole_id = req.user.roleId;
    const event = req.body;
    event.userId = req.user.id;

    // if (![1].includes(userRole_id)) {
    //   return res.status(403).json({
    //     error: true,
    //     payload: "Unauthorized. Only Admins can create items usage.",
    //   });
    // }

    if (!event.customerId) {
      return res.status(400).json({
        error: true,
        payload: "customerId is required.",
      });
    }

    const result = await eventService.createNewEvent(event);

    if (result.error) {
      return res.status(result.status).json({
        error: true,
        payload: result.payload,
      });
    } else {
      return res.status(result.status).json({
        error: false,
        payload: result.payload,
      });
    }
  } catch (error) {
    console.log("Error creating event controller: ", error);
    return res.status(500).json({
      error: true,
      payload: error,
    });
  }
}

module.exports = {
  registerEvent,
};
