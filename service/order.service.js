const { sequelize } = require("../models"); // Ensure sequelize is imported correctly
const { Events, Customers, ItemsUsage } = require("../models");

// Create New Order
async function createNewOrder(orderDetails) {
  try {
    const {
      name,
      nic,
      contactNo,
      address,
      eventName,
      eventDate,
      pax,
      venue,
      eventTime,
      returnDate,
      releaseDate,
    } = orderDetails;

    // Create a customer
    const createdCustomer = await Customers.create({
      name,
      nic,
      contactNo,
      address,
    });

    // Create an event
    const createdEvent = await Events.create({
      eventName,
      eventDate,
      pax,
      venue,
      eventTime,
      returnDate,
      releaseDate,
      state: "1",
      customerId: createdCustomer.id,
    });

    return {
      error: false,
      status: 200,
      payload: "Order successfully created!!",
    };
  } catch (e) {
    console.error(e);

    return {
      error: true,
      status: 500,
      payload: "An error occurred while creating the order.",
    };
  }
}

// Get all orders
async function getAllOrders() {
  try {
    const orders = await Events.findAll({
      include: [
        {
          model: Customers,
          as: "customer",
        },
      ],
    });
    if (!orders) {
      return {
        error: true,
        status: 404,
        payload: "No orders found!",
      };
    } else {
      return {
        error: false,
        status: 200,
        payload: orders,
      };
    }
  } catch (error) {
    console.error("Error getting all orders Service : ", error);
    throw error;
  }
}

// Get order by ID
async function getOrderById(id) {
  try {
    const order = await Events.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Customers,
          as: "customer",
        },
      ],
    });

    if (!order) {
      return {
        error: true,
        status: 404,
        payload: "Order not found.",
      };
    } else {
      return {
        error: false,
        status: 200,
        payload: order,
      };
    }
  } catch (e) {
    console.error(e);
    console.error("Error getting order by id Service : ", e);
    throw error;
  }
}

// Get orders by state
async function getOrdersByState(state) {
  try {
    const orders = await Events.findAll({
      where: {
        state: state,
      },
      include: [
        {
          model: Customers,
          as: "customer",
        },
      ],
    });
    if (!orders || orders.length === 0) {
      return {
        error: false,
        status: 200,
        payload: [],
      };
    } else {
      return {
        error: false,
        status: 200,
        payload: orders,
      };
    }
  } catch (error) {
    console.error("Error getting all orders Service : ", error);
    throw error;
  }
}

// Get order matrices
async function getOrderMatrices() {
  try {
    const states = {
      1: "waiting",
      2: "upcoming",
      3: "ongoing",
      4: "past",
    };

    const counts = await Events.findAll({
      attributes: [
        "state",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["state"],
      raw: true,
    });

    const result = counts.map((count) => ({
      stateName: states[count.state],
      eventCount: count.count,
    }));

    // Ensure all states are included, even if count is 0
    Object.values(states).forEach((stateName) => {
      if (!result.some((state) => state.stateName === stateName)) {
        result.push({ stateName, eventCount: 0 });
      }
    });

    return {
      error: false,
      status: 200,
      payload: result,
    };
  } catch (error) {
    console.error("Error Getting Order Counts By State Service: ", error);
    return {
      error: true,
      status: 500,
      payload: "Internal Server Error",
    };
  }
}

// Delete Order
async function deleteOrder(orderId) {
  try {
    // Find the event by ID
    const event = await Events.findByPk(orderId);

    if (!event) {
      return {
        error: true,
        status: 404,
        payload: "Event not found",
      };
    }

    // Find the customer associated with the event
    const customer = await Customers.findByPk(event.customerId);

    // Delete all items usage related to the event
    await ItemsUsage.destroy({ where: { eventId: orderId } });

    // Delete the event
    await event.destroy();

    // Check if the customer has any other events
    const otherEvents = await Events.findOne({
      where: { customerId: customer.id },
    });

    // If no other events are associated with the customer, delete the customer
    if (!otherEvents) {
      await customer.destroy();
    }

    return {
      error: false,
      status: 200,
      payload: "Order successfully deleted",
    };
  } catch (e) {
    console.error(e);

    return {
      error: true,
      status: 500,
      payload: "An error occurred while deleting the order",
    };
  }
}

module.exports = {
  createNewOrder,
  getAllOrders,
  getOrderById,
  getOrdersByState,
  getOrderMatrices,
  deleteOrder,
};
