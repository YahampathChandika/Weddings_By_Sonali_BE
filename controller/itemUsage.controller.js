const itemsUsageService = require("../service/itemUsage.service");

// Create New ItemsUsage
async function createItemsUsage(req, res) {
  try {
    const userRole_id = req.user.roleId;
    const itemsUsage = req.body;
    const userId = req.user.id;

    if (!Array.isArray(itemsUsage)) {
      return res.status(400).json({
        error: true,
        payload: "Request body should be an array of items usage data.",
      });
    }

    for (const itemUsage of itemsUsage) {
      if (!itemUsage.itemID) {
        return res.status(400).json({
          error: true,
          payload: "itemID is required for all items.",
        });
      }
      itemUsage.userId = userId;
    }

    const result = await itemsUsageService.createUsageItems(itemsUsage);

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
      payload: error,
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
      payload: error,
    });
  }
}

// itemUsage.controller.js
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

module.exports = {
  createItemsUsage,
  getAllSelectItems,
  getSelectItemUsageById,
};
