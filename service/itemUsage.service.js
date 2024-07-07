const { ItemsUsage, Items, Events, Customers } = require("../models");

async function createUsageItems(itemsUsageDataArray) {
  try {
    // Assuming all itemsUsageDataArray elements have the same eventID
    const eventID = itemsUsageDataArray[0].eventID;
    
    // Check if event exists before starting the transaction
    const event = await Events.findByPk(eventID);
    if (!event) {
      return {
        error: true,
        status: 404,
        payload: "Event not found.",
      };
    }

    const transaction = await ItemsUsage.sequelize.transaction();

    try {
      for (let itemsUsageData of itemsUsageDataArray) {
        let existingUsage = await ItemsUsage.findOne({
          where: {
            eventID: itemsUsageData.eventID,
            itemID: itemsUsageData.itemID
          },
          transaction
        });

        const item = await Items.findByPk(itemsUsageData.itemID, { transaction });
        if (!item) {
          await transaction.rollback();
          return {
            error: true,
            status: 404,
            payload: `Item with ID ${itemsUsageData.itemID} not found.`,
          };
        }

        const newQuantity = parseInt(itemsUsageData.quantity) || 0;

        if (existingUsage) {
          // Calculate the difference between the new quantity and the old quantity
          const quantityDifference = newQuantity - (parseInt(existingUsage.quantity) || 0);

          item.availableunits = (parseInt(item.availableunits) || 0) - quantityDifference;
          if (item.availableunits < 0) {
            await transaction.rollback();
            return {
              error: true,
              status: 400,
              payload: `Insufficient available units for item with ID ${itemsUsageData.itemID}.`,
            };
          }

          // Update the quantity in the existing row
          existingUsage.quantity = newQuantity;
          await existingUsage.save({ transaction });
        } else {
          item.availableunits = (parseInt(item.availableunits) || 0) - newQuantity;
          if (item.availableunits < 0) {
            await transaction.rollback();
            return {
              error: true,
              status: 400,
              payload: `Insufficient available units for item with ID ${itemsUsageData.itemID}.`,
            };
          }

          item.usedTimes = (parseInt(item.usedTimes) || 0) + 1;
          await item.save({ transaction });

          await ItemsUsage.create(itemsUsageData, { transaction });
        }

        await item.save({ transaction });
      }

      // Change the state of the event to 2 if it was previously 1
      if (event.state === '1') {
        event.state = '2';
        await event.save({ transaction });
      }

      await transaction.commit();

      return {
        error: false,
        status: 200,
        payload: "Select Item successfully created .",
      };
    } catch (error) {
      console.error("Error within transaction:", error);
      await transaction.rollback();
      return {
        error: true,
        status: 500,
        payload: "Internal server error.",
      };
    }
  } catch (error) {
    console.error("Error checking event or starting transaction:", error);
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

// itemsUsage.service.js
async function getSelectItemById(id) {
  try {
    const itemUsage = await ItemsUsage.findOne({
      where: { id },
      include: [
        {
          model: Items,
          as: 'items',
        }  
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

      item.availableunits = (parseInt(item.availableunits) || 0) + (parseInt(selectItems.quantity) || 0);
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

    item.availableunits = (parseInt(item.availableunits) || 0) + oldQuantity - newQuantity;

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



module.exports = {
  createUsageItems,
  getAllSelectItems,
  getSelectItemById,
  deleteSelectItem,
  updateSelctItem
};
