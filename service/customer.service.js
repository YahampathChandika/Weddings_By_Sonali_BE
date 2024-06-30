const { where } = require("sequelize");
const { Customers, Roles } = require("../models");

//Register Customer
async function registerCustomer(name, email, contactNo, address) {
  try {
    const emailExist = await Customers.findOne({
      where: {
        email: email,
      },
    });

    if (emailExist) {
      return {
        error: true,
        status: 409,
        payload: "Sorry, that email already exists!",
      };
    }

    const customer = await Customers.create({
      name: name,
      email: email,
      contactNo: contactNo,
      address: address,
    });

    return {
      error: false,
      status: 200,
      payload: "Customer Successfully Created!",
    };
  } catch (error) {
    console.log("Error registering Customer Service : ", error);
    throw error;
  }
}

module.exports = {
    registerCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
  };