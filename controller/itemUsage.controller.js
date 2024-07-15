const itemsUsageService = require("../service/itemUsage.service");

// Create New ItemsUsage
async function createItemsUsage(req, res) {
  try {
    const { eventID, items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        error: true,
        payload: "items should be an array of items usage data.",
      });
    }

    const result = await itemsUsageService.createUsageItems({ eventID, items });

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

async function getAllSelectItems(req, res) {
  try {
    const result = await itemsUsageService.getAllSelectItems();

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
    console.log("Error getting All ItemsUsage controller: ", error);
    return res.status(500).json({
      error: true,
      payload: "Internal server error",
    });
  }
}

async function getSelectItemUsageById(req, res) {
  try {
    const { id } = req.params;
    const result = await itemsUsageService.getSelectItemById(id);

    if (result.error) {
      return res.status(result.status).json({
        error: true,
        payload: result.payload,
      });
    }

    return res.status(result.status).json({
      error: false,
      payload: result.payload,
    });
  } catch (error) {
    console.error("Error retrieving ItemUsage by ID:", error);
    return res.status(500).json({
      error: true,
      payload: "Internal server error",
    });
  }
}

async function deleteSelectItem(req, res) {
  try {
    const { id } = req.params;
    const result = await itemsUsageService.deleteSelectItem(id);
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
    console.log("Error Deleting Select Items: ", error);
    return res.status(500).json({
      error: true,
      payload: "Internal server error",
    });
  }
}

// Update SelectItem
async function updateSelectItem(req, res) {
  try {
    const { id } = req.params;
    const selectItemData = req.body;

    const result = await itemsUsageService.updateSelectItem(id, selectItemData);

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
    console.log("Error Updating SelectItem Controller: ", error);
    return res.status(500).json({
      error: true,
      payload: "Internal server error",
    });
  }
}

async function isSelectItem(req, res) {
  try {
    const { eventID, items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        error: true,
        payload: "items should be an array of items data.",
      });
    }

    const result = await itemsUsageService.isSelectItem({ eventID, items });

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
    console.log("Error updating isSelect status of items: ", error);
    return res.status(500).json({
      error: true,
      payload: "Internal server error",
    });
  }
}

async function returnItems(req, res) {
  try {
    const { eventID, items } = req.body;

    const result = await itemsUsageService.returnItems({ eventID, items });

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
    console.log("Error returning items: ", error);
    return res.status(500).json({
      error: true,
      payload: "Internal server error",
    });
  }
}

module.exports = {
  createItemsUsage,
  getAllSelectItems,
  getSelectItemUsageById,
  deleteSelectItem,
  updateSelectItem,
  isSelectItem,
  returnItems,
};
