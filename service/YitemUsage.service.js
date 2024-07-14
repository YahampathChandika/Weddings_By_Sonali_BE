const { where } = require("sequelize");
const { ItemsUsage, Items, Events, Customers } = require("../models");

//Add Event Items
async function addEventItems(data) {
  try {
    const { eventId, items } = data;

    const event = await Events.findByPk(eventId);

    if (!event) {
      return {
        error: true,
        status: 404,
        message: "Event not found!",
      };
    }

    for (let itemData of items) {
      const item = await Items.findByPk(itemData.itemId);
      const existingUsage = await ItemsUsage.findOne({
        where: {
          eventId: eventId,
          itemId: itemData.itemId,
        },
      });

      if (!item) {
        return {
          error: true,
          status: 404,
          payload: `Item with ID ${itemData.itemID} not found.`,
        };
      }

      if (existingUsage) {
        (item.availableunits =
          (item.availableunits || 0) +
          existingUsage.quantity -
          itemData.quantity),
          (existingUsage.quantity = itemData.quantity);

        if (item.availableunits < 0) {
          return {
            error: true,
            status: 400,
            payload: `Insufficient available units for item with ID ${itemData.itemID}.`,
          };
        }
        await item.save();
        await existingUsage.save();
      } else {
        item.availableunits = (item.availableunits || 0) - itemData.quantity;

        if (item.availableunits < 0) {
          return {
            error: true,
            status: 400,
            payload: `Insufficient available units for item with ID ${itemData.itemID}.`,
          };
        }

        await item.save();

        await ItemsUsage.create({
          eventID: eventId,
          itemID: itemData.itemID,
          quantity: itemData.quantity,
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

module.exports = { addEventItems };
