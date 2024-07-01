const { ItemsUsage } = require("../models");

// Create New ItemsUsage
async function createUsageItem(itemsUsageData) {
  try {
    
    const newItemsUsage = await ItemsUsage.create(itemsUsageData);

    return {
      error: false,
      status: 200,
      payload: "ItemsUsage successfully created!",
      data: newItemsUsage,
    };
  } catch (error) {
    console.error("Error creating ItemsUsage service:", error);

    return {
      error: true,
      status: 500,
      payload: "Internal server error.",
    };
  }
}

module.exports = {
  createUsageItem,
};
