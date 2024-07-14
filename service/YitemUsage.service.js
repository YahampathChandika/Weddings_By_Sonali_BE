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

      const existingUsage = await ItemsUsage.findOne({
        where: {
          eventId: eventId,
          itemId: itemData.itemId,
        },
      });

      if (existingUsage) {
        const updatedAvailableUnits =
          item.availableunits + existingUsage.quantity - itemData.quantity;

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
          eventID: eventId,
          itemID: itemData.itemId,
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

module.exports = { addEventItems };
