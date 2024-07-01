const itemsUsageService = require("../service/itemUsage.service");

// Create New ItemsUsage
async function createItemsUsage(req, res) {
  try {
    const userRole_id = req.user.roleId;
    const itemsUsage = req.body;
    itemsUsage.userId = req.user.id;

    // if (![1].includes(userRole_id)) {
    //   return res.status(403).json({
    //     error: true,
    //     payload: "Unauthorized. Only Admins can create items usage.",
    //   });
    // }

    if (!itemsUsage.itemID) {
      return res.status(400).json({
        error: true,
        payload: "itemID is required.",
      });
    }

    const result = await itemsUsageService.createUsageItem(itemsUsage);

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

async function getAllUsedItems(req, res) {
  try {
    const result = await itemsUsageService.getAllUsedItems();

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



module.exports = {
  createItemsUsage,
  getAllUsedItems,
};
