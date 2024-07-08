const itemsUsageService = require("../service/itemUsage.service");

// Create New ItemsUsage
async function createItemsUsage(req, res) {
  try {
    const userRole_id = req.user.roleId;
    const { eventID, items } = req.body;
    const userId = req.user.id;

    if (!eventID) {
      return res.status(400).json({
        error: true,
        payload: "eventID is required.",
      });
    }

    if (!Array.isArray(items)) {
      return res.status(400).json({
        error: true,
        payload: "items should be an array of items usage data.",
      });
    }

    for (const item of items) {
      if (!item.itemID) {
        return res.status(400).json({
          error: true,
          payload: "itemID is required for all items.",
        });
      }
      item.userId = userId;
      item.eventID = eventID; // Add eventID to each item
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
      payload: error,
    });
  }
}

//Update SelctItem
async function updateSelctItem(req, res) {
  try {
    const { id } = req.params;
    const selctItemData = req.body;

    const result = await itemsUsageService.updateSelctItem(id, selctItemData);

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
    console.log("Error Updating SelctItem Controller: ", error);
    return res.status(500).json({
      error: true,
      payload: error,
    });
  }
}



module.exports = {
  createItemsUsage,
  getAllSelectItems,
  getSelectItemUsageById,
  deleteSelectItem,
  updateSelctItem
};
