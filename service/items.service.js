const { Items } = require("../models");

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

module.exports = {
  createItem,
};
