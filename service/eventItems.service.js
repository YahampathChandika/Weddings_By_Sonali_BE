const { where, Op } = require("sequelize");

const { ItemsUsage, Items, Events, Customers } = require("../models");

// Add Event Items
async function addEventItems(data) {
  try {
    const { eventId, items } = data;
    const event = await Events.findByPk(eventId);

    if (!event) {
      return {
        error: true,
        status: 404,
        payload: "Event not found!",
      };
    }

    // Fetch existing usages for the event
    const existingUsages = await ItemsUsage.findAll({
      where: { eventId: eventId },
    });

    // Create a map for quick lookup of existing usages
    const existingUsagesMap = new Map();
    existingUsages.forEach((usage) => {
      existingUsagesMap.set(usage.itemId, usage);
    });

    // Process each item in the new items list
    for (let itemData of items) {
      const item = await Items.findByPk(itemData.itemId);

      if (!item) {
        return {
          error: true,
          status: 404,
          payload: `Item with ID ${itemData.itemId} not found.`,
        };
      }

      const existingUsage = existingUsagesMap.get(itemData.itemId);

      if (existingUsage) {
        const updatedAvailableUnits =
          item.availableunits + existingUsage.quantity - itemData.quantity;

        if (updatedAvailableUnits < 0) {
          return {
            error: true,
            status: 400,
            payload: `Insufficient available units for item with code ${item.code}.`,
          };
        }

        item.availableunits = updatedAvailableUnits;
        existingUsage.quantity = itemData.quantity;

        await item.save();
        await existingUsage.save();

        // Remove processed item from the map
        existingUsagesMap.delete(itemData.itemId);
      } else {
        const updatedAvailableUnits = item.availableunits - itemData.quantity;

        if (updatedAvailableUnits < 0) {
          return {
            error: true,
            status: 400,
            payload: `Insufficient available units for item with code ${item.code}.`,
          };
        }

        item.availableunits = updatedAvailableUnits;
        await item.save();

        await ItemsUsage.create({
          eventId: eventId,
          itemId: itemData.itemId,
          quantity: itemData.quantity,
          isSelect: "0",
        });
      }
    }

    // Handle items that were not in the new items list (deleted items)
    for (let [itemId, existingUsage] of existingUsagesMap) {
      const item = await Items.findByPk(itemId);

      if (item) {
        item.availableunits += existingUsage.quantity;
        await item.save();
      }

      await ItemsUsage.destroy({
        where: {
          eventId: eventId,
          itemId: itemId,
        },
      });
    }

    if (event.state === "1") {
      event.state = "2";
      await event.save();
    }

    return {
      error: false,
      status: 200,
      payload: "Event Items Updated Successfully",
    };
  } catch (error) {
    console.error("Error within addEventItems:", error);
    return {
      error: true,
      status: 500,
      payload: "Internal server error.",
    };
  }
}

// Get event items by id
async function getEventItemsById(eventId) {
  try {
    const event = await Events.findByPk(eventId, {
      include: [
        {
          model: ItemsUsage,
          as: "itemsUsage",
          attributes: [
            "quantity",
            "returned",
            "damaged",
            "missing",
            "itemId",
            "isSelect",
          ],
          include: [
            {
              model: Items,
              as: "items",
              attributes: [
                "code",
                "itemName",
                "type",
                "usedTimes",
                "availableunits",
              ],
            },
          ],
        },
      ],
    });

    if (!event) {
      return {
        error: true,
        status: 404,
        payload: "Event not found!",
      };
    }

    const itemsDetails = event.itemsUsage.map((usage) => ({
      code: usage.items.code,
      name: usage.items.itemName,
      type: usage.items.type,
      usage: usage.items.usedTimes,
      available: usage.items.availableunits,
      quantity: usage.quantity,
      returned: usage.returned,
      damaged: usage.damaged,
      missing: usage.missing,
      itemId: usage.itemId,
      isSelect: usage.isSelect,
    }));

    return {
      error: false,
      status: 200,
      payload: itemsDetails,
    };
  } catch (error) {
    console.error("Error within getEventItemsById:", error);
    return {
      error: true,
      status: 500,
      payload: "Internal server error.",
    };
  }
}

// Get Release Item List
async function getReleaseItemList(eventId) {
  try {
    const eventData = await Events.findByPk(eventId, {
      include: [
        {
          model: ItemsUsage,
          as: "itemsUsage",
          where: {
            isSelect: false,
          },
          attributes: [
            "quantity",
            "returned",
            "damaged",
            "missing",
            "itemId",
            "isSelect",
          ],
          include: [
            {
              model: Items,
              as: "items",
              attributes: [
                "code",
                "itemName",
                "type",
                "usedTimes",
                "availableunits",
              ],
            },
          ],
        },
      ],
    });

    if (!eventData || eventData.itemsUsage.length === 0) {
      // Check if the event state is 2 and update it to 3 if there are no items
      const event = await Events.findByPk(eventId);
      if (event.state === "2") {
        event.state = "3";
        await event.save();
      }

      return {
        error: false,
        status: 200,
        payload: [],
      };
    }

    const itemsDetails = eventData.itemsUsage.map((usage) => ({
      code: usage.items.code,
      name: usage.items.itemName,
      type: usage.items.type,
      usage: usage.items.usedTimes,
      available: usage.items.availableunits,
      quantity: usage.quantity,
      returned: usage.returned,
      damaged: usage.damaged,
      missing: usage.missing,
      itemId: usage.itemId,
      isSelect: usage.isSelect,
    }));

    return {
      error: false,
      status: 200,
      payload: itemsDetails,
    };
  } catch (error) {
    console.error("Error within getEventItemsById:", error);
    return {
      error: true,
      status: 500,
      payload: "Internal server error.",
    };
  }
}

// Release Event Items
async function releaseEventItems(eventId, items) {
  try {
    let selectedItemsCount = 0;

    for (let itemData of items) {
      const { itemId, isSelect } = itemData;
      const item = await Items.findByPk(itemId);

      if (!item) {
        return {
          error: true,
          status: 404,
          payload: `Item with ID ${itemId} not found.`,
        };
      }

      if (isSelect) {
        selectedItemsCount++;
      }

      const eventItem = await ItemsUsage.findOne({
        where: {
          itemId: itemId,
          eventId: eventId,
        },
      });

      if (!eventItem) {
        return {
          error: true,
          status: 404,
          payload: `No usage found for item with ID ${itemId}.`,
        };
      }

      eventItem.isSelect = isSelect;
      await eventItem.save();
    }

    const event = await Events.findByPk(eventId);

    if (selectedItemsCount === 0) {
      return {
        error: true,
        status: 400,
        payload: "No items selected for release.",
      };
    }

    // Check if all items are released and update the event state to 3 if so
    const remainingItems = await ItemsUsage.count({
      where: {
        eventId: eventId,
        isSelect: true,
      },
    });

    if (remainingItems === 0) {
      event.state = "3";
      await event.save();
    }

    return {
      error: false,
      status: 200,
      payload: "Event Items Released Successfully",
    };
  } catch (e) {
    console.error("Error within releaseEventItems:", e);
    return {
      error: true,
      status: 500,
      payload: "Internal server error.",
    };
  }
}

// Get Return Item List
async function getReturnItemList(eventId) {
  try {
    const event = await Events.findByPk(eventId);

    if (!event) {
      return {
        error: true,
        status: 404,
        payload: "Event not found!",
      };
    }

    const eventItems = await ItemsUsage.findAll({
      where: {
        eventId: eventId,
        isSelect: true,
        returned: { [Op.eq]: null },
      },
      attributes: ["itemId", "quantity", "returned", "damaged", "missing"],
      include: [
        {
          model: Items,
          as: "items",
          attributes: ["code", "itemName", "type", "wash"],
        },
      ],
    });

    const formattedItems = eventItems.map((eventItem) => ({
      itemId: eventItem.itemId,
      code: eventItem.items.code,
      itemName: eventItem.items.itemName,
      type: eventItem.items.type,
      quantity: eventItem.quantity,
      returned: eventItem.returned,
      damaged: eventItem.damaged,
      missing: eventItem.missing,
      wash: eventItem.items.wash,
    }));

    // if (eventItems.length === 0) {
    //   return {
    //     error: true,
    //     status: 400,
    //     payload: "No items selected for release.",
    //   };
    // } else {
    //   return {
    //     error: false,
    //     status: 200,
    //     payload: formattedItems,
    //   };
    // }

    return {
      error: false,
      status: 200,
      payload: formattedItems,
    };
  } catch (e) {
    console.error("Error getting return item list: ", e);
    return {
      error: true,
      status: 500,
      payload: "Internal server error.",
    };
  }
}

//Return Event Items
async function returnEventItems(eventId, items) {
  try {
    const event = await Events.findByPk(eventId);

    if (!event) {
      return {
        error: true,
        status: 404,
        payload: "Event not found!",
      };
    }

    for (itemData of items) {
      const { itemId, returned, damaged } = itemData;
      const eventItem = await ItemsUsage.findOne({
        where: {
          itemId: itemId,
          eventId: eventId,
        },
      });

      if (!eventItem) {
        return {
          error: true,
          status: 404,
          payload: `No usage found for item with ID ${itemId}.`,
        };
      }

      const item = await Items.findByPk(itemId);

      if (!item) {
        return {
          error: true,
          status: 404,
          payload: `Item with ID ${itemId} not found.`,
        };
      }

      if (eventItem.quantity < returned + damaged) {
        return {
          error: true,
          status: 400,
          payload: `Item ${item.itemName} has only ${eventItem.quantity} units available for return.`,
        };
      }

      const missing = eventItem.quantity - returned;

      eventItem.returned = returned;
      eventItem.damaged = damaged;
      eventItem.missing = missing;
      await eventItem.save();

      item.availableunits += returned;
      item.damaged += damaged;
      item.missing += missing;
      item.usedTimes++;
      await item.save();
    }

    return {
      error: false,
      status: 200,
      payload: "Event Items Returned Successfully",
    };
  } catch (error) {
    console.log("Error creating ItemsUsage controller: ", error);
    return {
      error: true,
      status: 500,
      payload: "Internal server error.",
    };
  }
}

//Get washing items list
async function getWahingItemsList(eventId) {
  try {
    const event = await Events.findByPk(eventId, {
      include: [
        {
          model: ItemsUsage,
          as: "itemsUsage",
          attributes: [
            "quantity",
            "returned",
            "damaged",
            "missing",
            "itemId",
            "isSelect",
          ],
          include: [
            {
              model: Items,
              as: "items",
              where: {
                wash: true,
              },
              attributes: [
                "code",
                "itemName",
                "type",
                "usedTimes",
                "availableunits",
              ],
            },
          ],
        },
      ],
    });

    if (!event) {
      return {
        error: true,
        status: 404,
        payload: "Event not found!",
      };
    }

    const itemsDetails = event.itemsUsage.map((usage) => ({
      code: usage.items.code,
      name: usage.items.itemName,
      type: usage.items.type,
      usage: usage.items.usedTimes,
      available: usage.items.availableunits,
      quantity: usage.quantity,
      returned: usage.returned,
      damaged: usage.damaged,
      missing: usage.missing,
      itemId: usage.itemId,
      isSelect: usage.isSelect,
    }));

    return {
      error: false,
      status: 200,
      payload: itemsDetails,
    };
  } catch (error) {
    console.error("Error within getEventItemsById:", error);
    return {
      error: true,
      status: 500,
      payload: "Internal server error.",
    };
  }
}

module.exports = {
  addEventItems,
  getEventItemsById,
  getReleaseItemList,
  releaseEventItems,
  returnEventItems,
  getReturnItemList,
  getWahingItemsList,
};
