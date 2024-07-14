const itemsUsageService = require("../service/YitemUsage.service");

async function addEventItems(req, res) {
  try {
    const { eventId, items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        error: true,
        payload: "items should be an array of items usage data.",
      });
    }

    const result = await itemsUsageService.addEventItems({ eventId, items });

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
    console.log("Error creating ItemsUsage controller: ", error);
    return res.status(500).json({
      error: true,
      payload: "Internal server error",
    });
  }
}

module.exports = { addEventItems };
