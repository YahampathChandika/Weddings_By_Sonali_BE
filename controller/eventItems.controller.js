const itemsUsageService = require("../service/eventItems.service");

// Add Event Items
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

//Release Event Items
async function releaseEventItems(req, res) {
  try {
    const { eventId, items } = req.body;
    const result = await itemsUsageService.releaseEventItems(eventId, items);

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

//Return Event Items
async function returnEventItems(req, res) {
  try {
    const { eventId, items } = req.body;
    const result = await itemsUsageService.returnEventItems(eventId, items);

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
    return {
      error: true,
      status: 500,
      payload: "Internal server error.",
    };
  }
}

// Get Return Item List
async function getReturnItemList(req, res) {
  try {
    const { eventId } = req.params;

    const result = await itemsUsageService.getReturnItemList(eventId);

    if (result.error) {
      return res.status(result.status).json({
        error: true,
        payload: result.payload,
      });
    } else {
      const payload = result.payload.map((eventItem) => ({
        code: eventItem.items.code,
        itemName: eventItem.items.itemName,
        type: eventItem.items.type,
        quantity: eventItem.quantity,
        returned: eventItem.returned,
        damaged: eventItem.damaged,
        missing: eventItem.missing,
      }));
      return res.status(result.status).json({
        error: false,
        payload: payload,
      });
    }
  } catch (error) {
    console.error("Error in ItemsUsage controller:", error);
    return res.status(500).json({
      error: true,
      payload: "Internal server error.",
    });
  }
}

module.exports = {
  addEventItems,
  releaseEventItems,
  returnEventItems,
  getReturnItemList,
};
