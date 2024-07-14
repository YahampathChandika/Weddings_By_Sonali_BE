const itemsUsageService = require("../service//YitemUsage.service");

async function addEventItems(req, res) {
  try {
    const { eventId, items } = req.body;

    if (!eventId) {
      return res.status(400).json({
        error: true,
        payload: "eventId is required.",
      });
    }

    for (let item of items) {
      if (!item.itemID) {
        return res.status(400).json({
          error: true,
          payload: "itemId is required for all items.",
        });
      }

      const response = await itemsUsageService.addEventItems(item.eventId, item);
    }
  } catch (e) {}
}

module.exports = { addEventItems };
