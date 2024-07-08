const { where } = require("sequelize");
const { Events, Customers } = require("../models");

// Create New Order
async function createNewOrder(orderDetails) {
  try {
    const {
      name,
      email,
      contactNo,
      address,
      eventName,
      eventDate,
      pax,
      venue,
      eventTime,
      returnDate,
      itemTakeDate,
    } = orderDetails;

    // Create a customer
    const createdCustomer = await Customers.create({
      name,
      email,
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
      itemTakeDate,
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

module.exports = {
  createNewOrder,
  getAllOrders,
  getOrderById,
};
