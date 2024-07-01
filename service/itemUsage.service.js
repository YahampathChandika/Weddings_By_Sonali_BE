const { ItemsUsage, Items } = require("../models");

// Create New ItemsUsage
async function createUsageItem(itemsUsageData) {
  const transaction = await ItemsUsage.sequelize.transaction();

  try {
    const newItemsUsage = await ItemsUsage.create(itemsUsageData, { transaction });

    const item = await Items.findByPk(itemsUsageData.itemID, { transaction });
    if (!item) {
      await transaction.rollback();
      return {
        error: true,
        status: 404,
        payload: "Item not found.",
      };
    }

    // Decrement availableunits by the used quantity
    const usedQuantity = parseInt(itemsUsageData.quantity) || 0;
    item.availableunits = (parseInt(item.availableunits) || 0) - usedQuantity;

    // Ensure availableunits is not less than 0
    if (item.availableunits < 0) {
      await transaction.rollback();
      return {
        error: true,
        status: 400,
        payload: "Insufficient available units.",
      };
    }

    // Save the updated item
    item.usedTimes = (parseInt(item.usedTimes) || 0) + 1;
    await item.save({ transaction });

    await transaction.commit();

    return {
      error: false,
      status: 200,
      payload: "ItemsUsage successfully created!",
      data: newItemsUsage,
    };
  } catch (error) {
    console.error("Error creating ItemsUsage service:", error);
    await transaction.rollback();
    return {
      error: true,
      status: 500,
      payload: "Internal server error.",
    };
  }
}

async function getAllUsedItems() {
  try {
    const items = await ItemsUsage.findAll();

    return {
      error: false,
      status: 200,
      payload: items,
    };
  } catch (error) {
    console.error("Error getting items service:", error);

    return {
      error: true,
      status: 500,
      payload: "Internal server error.",
    };
  }
}

module.exports = {
  createUsageItem,
  getAllUsedItems,
};
