const { where } = require("sequelize");
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

    for (let itemData of items) {
      const item = await Items.findByPk(itemData.itemId);

      if (!item) {
        return {
          error: true,
          status: 404,
          payload: `Item with ID ${itemData.itemId} not found.`,
        };
      }

      let existingUsage = await ItemsUsage.findOne({
        where: {
          eventId: eventId,
          itemId: itemData.itemId,
        },
      });

      if (existingUsage) {
        const updatedAvailableUnits =
          item.availableunits + existingUsage.quantity - itemData.quantity;

          console.log("updatedAvailableUnits", updatedAvailableUnits);

        if (updatedAvailableUnits < 0) {
          return {
            error: true,
            status: 400,
            payload: `Insufficient available units for item with ID ${itemData.itemId}.`,
          };
        }

        item.availableunits = updatedAvailableUnits;
        existingUsage.quantity = itemData.quantity;

        await item.save();
        await existingUsage.save();
      } else {
        const updatedAvailableUnits = item.availableunits - itemData.quantity;

        if (updatedAvailableUnits < 0) {
          return {
            error: true,
            status: 400,
            payload: `Insufficient available units for item with ID ${itemData.itemId}.`,
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

    if (event.state === "1") {
      event.state = "2";
      await event.save();
    }

    return {
      error: false,
      status: 200,
      payload: "Event Items Added Successfully",
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

//Release Event Items
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
          itemID: itemId,
          eventID: eventId,
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
      event.state = "2";
      await event.save();

      return {
        error: true,
        status: 400,
        payload: "No items selected for release.",
      };
    } else {
      event.state = "3";
      await event.save();

      return {
        error: false,
        status: 200,
        payload: "Event Items Released Successfully",
      };
    }
  } catch (e) {
    console.error("Error within releaseEventItems:", e);
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
          itemID: itemId,
          eventID: eventId,
        },
      });

      if (!eventItem) {
        return {
          error: true,
          status: 404,
          payload: `No usage found for item with ID ${itemId}.`,
        };
      }

      if (eventItem.quantity < returned + damaged) {
        return {
          error: true,
          status: 400,
          payload: `Item with ID ${itemId} has only ${eventItem.quantity} units available for return.`,
        };
      }

      const missing = eventItem.quantity - returned;

      eventItem.returned = returned;
      eventItem.damaged = damaged;
      eventItem.missing = missing;
      await eventItem.save();

      const item = await Items.findByPk(itemId);

      if (!item) {
        return {
          error: true,
          status: 404,
          payload: `Item with ID ${itemId} not found.`,
        };
      }

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
        eventID: eventId,
      },
      include: [
        {
          model: Items,
          as: "items",
          attributes: ["code", "itemName", "type"],
        },
      ],
      attributes: ["quantity", "returned", "damaged", "missing"],
    });

    return {
      error: false,
      status: 200,
      payload: eventItems,
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

module.exports = {
  addEventItems,
  releaseEventItems,
  returnEventItems,
  getReturnItemList,
};
