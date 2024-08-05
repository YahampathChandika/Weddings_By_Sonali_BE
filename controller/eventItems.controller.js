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

// Get Event Items by Event ID
async function getEventItemsById(req, res) {
  try {
    const { eventId } = req.params;

    const result = await itemsUsageService.getEventItemsById(eventId);

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
    console.error("Error retrieving event items:", error);
    return res.status(500).json({
      error: true,
      payload: "Internal server error",
    });
  }
}

// Get Release Items List
async function getReleaseItemList(req, res) {
  try {
    const { eventId } = req.params;

    const result = await itemsUsageService.getReleaseItemList(eventId);

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
    console.error("Error retrieving event items:", error);
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
      return res.status(result.status).json({
        error: false,
        payload: result.payload,
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

// Get Wash List Controller
async function getWashList(req, res) {
  try {
    const { eventId } = req.params;
    const result = await itemsUsageService.getWashList(eventId);

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
  } catch (err) {
    console.error("Error Getting Wash List Controller: ", err);
    return res.status(500).json({
      error: true,
      payload: "Internal server error.",
    });
  }
}

// Mark Items As Washed Controller
async function markItemsAsWashed(req, res) {
  try {
    const items = req.body.items;
    const result = await itemsUsageService.markItemsAsWashed(items);

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
  } catch (err) {
    console.error("Error Marking Items As Washed Controller: ", err);
    return res.status(500).json({
      error: true,
      payload: "Internal server error.",
    });
  }
}

module.exports = {
  addEventItems,
  getEventItemsById,
  releaseEventItems,
  returnEventItems,
  getReturnItemList,
  getReleaseItemList,
  getWashList,
  markItemsAsWashed,
};
