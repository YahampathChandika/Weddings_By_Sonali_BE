const { Items, ItemsUsage } = require("../models");

// Create New Item
async function createItem(item) {
  try {
    const itemExist = await Items.findOne({
      where: {
        itemName: item.itemName,
      },
    });

    if (itemExist) {
      return {
        error: true,
        status: 409,
        payload: "Sorry, the item is already saved.",
      };
    }

    item.availableunits = item.quantity;
    const newItem = await Items.create(item);

    return {
      error: false,
      status: 200,
      payload: "Item successfully created!",
      data: newItem,
    };
  } catch (error) {
    console.error("Error creating item service:", error);
    return {
      error: true,
      status: 500,
      payload: "Internal server error.",
    };
  }
}

// Get All Items
async function getAllItems() {
  try {
    const items = await Items.findAll();

    const itemsUsage = await ItemsUsage.findAll();

    const usedQuantitiesMap = {};
    itemsUsage.forEach((usage) => {
      const itemId = usage.itemID;
      const usedQuantity = parseInt(usage.quantity) || 0;
      if (usedQuantitiesMap[itemId]) {
        usedQuantitiesMap[itemId] += usedQuantity;
      } else {
        usedQuantitiesMap[itemId] = usedQuantity;
      }
    });

    items.forEach((item) => {
      const itemId = item.id;
      const totalUsedQuantity = usedQuantitiesMap[itemId] || 0;
      item.availableunits = (parseInt(item.quantity) || 0) - totalUsedQuantity;
    });

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

//Get Item By Id
async function getItemById(id) {
  try {
    const Item = await Items.findOne({
      where: {
        id: id,
      },
    });

    if (!Item) {
      return {
        error: true,
        status: 404,
        payload: "No Item date Available!",
      };
    } else {
      return {
        error: false,
        status: 200,
        payload: Item,
      };
    }
  } catch (error) {
    console.error("Error getting Item by ID service :", error);
    throw error;
  }
}

//Delete an Items
async function deleteItems(id) {
  try {
    const items = await Items.findByPk(id);

    if (!items) {
      return {
        error: true,
        status: 404,
        payload: "Items not found!",
      };
    } else {
      await items.destroy();
      return {
        error: false,
        status: 200,
        payload: "Items successfully deleted!",
      };
    }
  } catch (error) {
    console.error("Error deleteing Items service: ", error);
    throw error;
  }
}

// Update Items
async function updateItems(id, updatedData) {
  try {
    const items = await Items.findByPk(id);

    if (!items) {
      return {
        error: true,
        status: 404,
        payload: "Items not found!",
      };
    } else {
      if (updatedData.quantity) {
        updatedData.availableunits = updatedData.quantity;
      }

      await Items.update(updatedData, {
        where: { id: id },
      });

      return {
        error: false,
        status: 200,
        payload: "Items updated successfully!",
      };
    }
  } catch (error) {
    console.error("Error Updating Items Service : ", error);
    throw error;
  }
}

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  deleteItems,
  updateItems,
};
