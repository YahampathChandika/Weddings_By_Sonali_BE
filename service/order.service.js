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
      state,
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

    // Prepare the result object
    // const orders = customers.map(customer => {
    //     return {
    //         customerId: customer.id,
    //         name: customer.name,
    //         email: customer.email,
    //         contactNo: customer.contactNo,
    //         address: customer.address,
    //         events: customer.events.map(event => ({
    //             eventName: event.eventName,
    //             eventDate: event.eventDate,
    //             pax: event.pax,
    //             venue: event.venue,
    //             eventTime: event.eventTime,
    //             returnDate: event.returnDate,
    //             itemTakeDate: event.itemTakeDate,
    //             state: event.state
    //         }))
    //     };
    // });

    return {
      error: false,
      status: 200,
      payload: orders,
    };
  } catch (error) {
    console.error(error);

    return {
      error: true,
      status: 500,
      payload: "An error occurred while fetching the orders.",
    };
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
      }
  
      return {
        error: false,
        status: 200,
        payload: order,
      };
    } catch (e) {
      console.error(e);
      return {
        error: true,
        status: 500,
        payload: "An error occurred while fetching the order.",
      };
    }
  }
  
  module.exports = {
    createNewOrder,
    getAllOrders,
    getOrderById
  };