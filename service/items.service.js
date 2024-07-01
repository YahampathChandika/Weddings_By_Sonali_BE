const { Items } = require("../models");

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

    if (!items) {
      return {
        error: true,
        status: 404,
        payload: "No items data available!",
      };
    } else {
      return {
        error: false,
        status: 200,
        payload: items,
      };
    }
  } catch (error) {
    console.error("Error getting items service :", error);
    throw error;
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
              payload: "Items not found!"
          };
      } else {
          await Items.update(updatedData, {
              where: { id: id }
          });

          return {
              error: false,
              status: 200,
              payload: "Items updated successfully!"
          };
      }
  } catch (error) {
      console.error('Error Updating Items Service : ', error);
      throw error;
  }
}


module.exports = {
  createItem,
  getAllItems,
  getItemById,
  deleteItems,
  updateItems
};
