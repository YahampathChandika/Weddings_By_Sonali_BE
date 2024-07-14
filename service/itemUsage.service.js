const { ItemsUsage, Items, Events, Customers } = require("../models");

async function createUsageItems(data) {
  try {
    const { eventID, items } = data;

    const event = await Events.findByPk(eventID);
    if (!event) {
      return {
        error: true,
        status: 404,
        payload: "Event not found.",
      };
    }

    for (let itemData of items) {
      let existingUsage = await ItemsUsage.findOne({
        where: {
          eventID: eventID,
          itemID: itemData.itemID,
        },
      });

      const item = await Items.findByPk(itemData.itemID);
      if (!item) {
        return {
          error: true,
          status: 404,
          payload: `Item with ID ${itemData.itemID} not found.`,
        };
      }

      const newQuantity = parseInt(itemData.quantity) || 0;

      if (existingUsage) {
        const quantityDifference =
          newQuantity - (parseInt(existingUsage.quantity) || 0);
        item.availableunits =
          (parseInt(item.availableunits) || 0) - quantityDifference;
        if (item.availableunits < 0) {
          return {
            error: true,
            status: 400,
            payload: `Insufficient available units for item with ID ${itemData.itemID}.`,
          };
        }

        existingUsage.quantity = newQuantity;
        await existingUsage.save();
      } else {
        item.availableunits =
          (parseInt(item.availableunits) || 0) - newQuantity;
        if (item.availableunits < 0) {
          return {
            error: true,
            status: 400,
            payload: `Insufficient available units for item with ID ${itemData.itemID}.`,
          };
        }

        item.usedTimes = (parseInt(item.usedTimes) || 0) + 1;
        await item.save();

        await ItemsUsage.create({
          eventID: eventID,
          itemID: itemData.itemID,
          quantity: newQuantity,
          isSelect: "0",
        });
      }
      await item.save();
    }

    if (event.state === "1") {
      event.state = "2";
      await event.save();
    }

    return {
      error: false,
      status: 200,
      payload: "Select Item successfully created.",
    };
  } catch (error) {
    console.error("Error within createUsageItems:", error);
    return {
      error: true,
      status: 500,
      payload: "Internal server error.",
    };
  }
}

async function getAllSelectItems() {
  try {
    const items = await Events.findAll({
      include: [
        {
          model: Customers,
          as: "customer",
        },
        {
          model: ItemsUsage,
          as: "itemsUsage",
        },
      ],
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

async function getSelectItemById(id) {
  try {
    const itemUsage = await ItemsUsage.findOne({
      where: { id },
      include: [
        {
          model: Items,
          as: "items",
        },
      ],
    });

    if (!itemUsage) {
      return {
        error: true,
        status: 404,
        payload: "ItemUsage not found",
      };
    }

    return {
      error: false,
      status: 200,
      payload: itemUsage,
    };
  } catch (error) {
    console.error("Error retrieving ItemUsage:", error);
    return {
      error: true,
      status: 500,
      payload: "Internal server error",
    };
  }
}

async function deleteSelectItem(id) {
  try {
    const selectItems = await ItemsUsage.findByPk(id);
    if (!selectItems) {
      return {
        error: true,
        status: 404,
        payload: "ItemsUsage not found!",
      };
    } else {
      const item = await Items.findByPk(selectItems.itemID);
      if (!item) {
        return {
          error: true,
          status: 404,
          payload: "Item not found!",
        };
      }

      item.availableunits =
        (parseInt(item.availableunits) || 0) +
        (parseInt(selectItems.quantity) || 0);
      item.usedTimes = Math.max((parseInt(item.usedTimes) || 0) - 1, 0); // Ensure usedTimes does not go below 0
      await item.save();

      await selectItems.destroy();

      return {
        error: false,
        status: 200,
        payload: "ItemsUsage successfully deleted!",
      };
    }
  } catch (error) {
    console.error("Error deleting ItemsUsage service: ", error);
    return {
      error: true,
      status: 500,
      payload: "Internal server error.",
    };
  }
}

async function updateSelctItem(id, updateData) {
  try {
    const updateSelectItem = await ItemsUsage.findByPk(id);

    if (!updateSelectItem) {
      return {
        error: true,
        status: 404,
        payload: "ItemUsage not found!",
      };
    }

    const item = await Items.findByPk(updateSelectItem.itemID);
    if (!item) {
      return {
        error: true,
        status: 404,
        payload: "Item not found!",
      };
    }

    const oldQuantity = parseInt(updateSelectItem.quantity) || 0;
    const newQuantity = parseInt(updateData.quantity) || 0;

    item.availableunits =
      (parseInt(item.availableunits) || 0) + oldQuantity - newQuantity;

    if (item.availableunits < 0) {
      return {
        error: true,
        status: 400,
        payload: "Insufficient available units for item.",
      };
    }

    await item.save();
    await updateSelectItem.update(updateData);

    return {
      error: false,
      status: 200,
      payload: "ItemUsage successfully updated!",
    };
  } catch (error) {
    console.error("Error updating ItemUsage:", error);
    return {
      error: true,
      status: 500,
      payload: "Internal server error.",
    };
  }
}

async function isSelectItem(data) {
  try {
    const { eventID, items } = data;
    const event = await Events.findByPk(eventID);
    if (!event) {
      return {
        error: true,
        status: 404,
        payload: "Event not found.",
      };
    }

    for (let itemData of items) {
      let existingUsage = await ItemsUsage.findOne({
        where: {
          eventID: eventID,
          itemID: itemData.itemID,
        },
      });

      if (!existingUsage) {
        return {
          error: true,
          status: 404,
          payload: `ItemUsage with itemID ${itemData.itemID} not found.`,
        };
      }

      existingUsage.isSelect = itemData.isSelect;
      await existingUsage.save();
    }

    const itemsForEvent = await ItemsUsage.findAll({
      where: { eventID },
      attributes: ["isSelect"],
    });

    const anySelected = itemsForEvent.some((item) => item.isSelect === "1");
    const allDeselected = itemsForEvent.every((item) => item.isSelect === "0");

    if (anySelected) {
      event.state = "3";
    } else if (allDeselected) {
      event.state = "2";
    }

    await event.save();

    return {
      error: false,
      status: 200,
      payload: "ItemUsage isSelect status successfully updated.",
    };
  } catch (error) {
    console.error("Error updating isSelect status:", error);
    return {
      error: true,
      status: 500,
      payload: "Internal server error.",
    };
  }
}

module.exports = {
  createUsageItems,
  getAllSelectItems,
  getSelectItemById,
  deleteSelectItem,
  updateSelctItem,
  isSelectItem,
};
