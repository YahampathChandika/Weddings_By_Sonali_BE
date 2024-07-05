const { Events , Customers }  = require("../models");

// Create New Event
async function createNewEvent(event) {
    try{
        const events  = await Events.create(event);
        
        return {
            error: false,
            status: 200,
            payload: "events successfully created!"

        };

    } catch(e){
        console.log(e);
        return {
            error: true,
            status: 500,
            payload: "An error occurred while event.",
        };
    }
    
}

module.exports = {
    createNewEvent
};