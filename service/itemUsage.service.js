const { ItemsUsage, Items, Events, Customers } = require("../models");

// Create Usage Items
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
        const quantityDifference = newQuantity - (parseInt(existingUsage.quantity) || 0);
        item.availableunits = (parseInt(item.availableunits) || 0) - quantityDifference;
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
        item.availableunits = (parseInt(item.availableunits) || 0) - newQuantity;
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

      item.availableunits = (parseInt(item.availableunits) || 0) + (parseInt(selectItems.quantity) || 0);
      item.usedTimes = Math.max((parseInt(item.usedTimes) || 0) - 1, 0);
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

async function updateSelectItem(id, updateData) {
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

    const allSelect = itemsForEvent.every((item) => item.isSelect === "1");

    if (allSelect) {
      event.state = "3";
    } else {
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

// Return Items
// async function returnItems(data) {
//   try {
//     const { eventID, items } = data;

//     const event = await Events.findByPk(eventID);
//     if (!event) {
//       return {
//         error: true,
//         status: 404,
//         payload: "Event not found.",
//       };
//     }

//     for (let itemData of items) {
//       let selectItem = await ItemsUsage.findOne({
//         where: {
//           eventID: eventID,
//           itemID: itemData.itemID,
//         },
//       });

//       if (!selectItem) {
//         return {
//           error: true,
//           status: 404,
//           payload: `ItemUsage with itemID ${itemData.itemID} not found.`,
//         };
//       }

//       const item = await Items.findByPk(itemData.itemID);
//       if (!item) {
//         return {
//           error: true,
//           status: 404,
//           payload: `Item with ID ${itemData.itemID} not found.`,
//         };
//       }

//       const returnQuantity = parseInt(itemData.returnQuantity) || 0;
//       const damagedUnits = parseInt(itemData.damage) || 0;
//       const goodUnits = returnQuantity - damagedUnits;

//       if (goodUnits < 0) {
//         return {
//           error: true,
//           status: 400,
//           payload: "Damaged units cannot exceed the returned quantity.",
//         };
//       }

//       const totalUsedQuantity = parseInt(selectItem.quantity) || 0;
//       const missingUnits = totalUsedQuantity - (returnQuantity + damagedUnits);

//       const initialDamaged = selectItem.damaged || 0;
//       const initialMissing = selectItem.missing || 0;

//       if (initialDamaged !== damagedUnits || initialMissing !== missingUnits) {
//         if (goodUnits > 0) {
//           item.availableunits = (parseInt(item.availableunits) || 0) + goodUnits;
//         }

//         item.damage = (parseInt(item.damage) || 0) + (damagedUnits );
//         item.missing = (parseInt(item.missing) || 0) + (missingUnits);

//         await item.save();

//         selectItem.damaged = damagedUnits;
//         selectItem.missing = missingUnits;
//         await selectItem.save();
//       }
//     }

//     return {
//       error: false,
//       status: 200,
//       payload: "Items successfully returned!",
//     };
//   } catch (error) {
//     console.error("Error returning items:", error);
//     return {
//       error: true,
//       status: 500,
//       payload: "Internal server error.",
//     };
//   }
// }


module.exports = {
  createUsageItems,
  getAllSelectItems,
  getSelectItemById,
  deleteSelectItem,
  updateSelectItem,
  isSelectItem,
  // returnItems,
};
