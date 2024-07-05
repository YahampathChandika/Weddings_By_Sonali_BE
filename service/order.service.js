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
            state: '1' ,
            customerId: createdCustomer.id 

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
        const customers = await Customers.findAll({
            include: [
                {
                    model: Events,
                    as: 'events'
                }
            ]
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
        //             eventName: event.name,
        //             eventDate: event.date,
        //             pax: event.pax,
        //             venue: event.venue,
        //             eventTime: event.time,
        //             returnDate: event.returnDate,
        //             itemTakeDate: event.itemTakeDate,
        //             state: event.state
        //         }))
        //     };
        // });

        return {
            error: false,
            status: 200,
            payload: customers,
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