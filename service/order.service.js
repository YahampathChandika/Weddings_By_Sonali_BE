const { Events, Customers } = require('../models');

// Create New Order
async function createNewOrder(orderDetails) {
    try {
        const { name, email, contactNo, address, eventName, eventDate, pax, venue, eventTime, returnDate, itemTakeDate, state } = orderDetails;

        // Create a customer
        const createdCustomer = await Customers.create({ name, email, contactNo, address });

        // Create an event
        const createdEvent = await Events.create({
            eventName,
            eventDate,
            pax,
            venue,
            eventTime,
            returnDate,
            itemTakeDate,
            state,
            customerId: createdCustomer.id 

        });

        return {
            error: false,
            status: 200,
            payload: "Customer and Event Order created!",
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
        const customerDetails = await Customers.findAll({
            include: [
                {
                    model: Events,
                    as: 'events'
                }
            ]
        });

        return {
            error: false,
            status: 200,
            payload: customerDetails,
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

module.exports = {
    createNewOrder,
    getAllOrders,
};