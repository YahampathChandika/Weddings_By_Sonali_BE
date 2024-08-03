const { Customers, Roles } = require("../models");

//Register Customer
async function registerCustomer(name, nic, contactNo, address) {
  try {
    const customer = await Customers.create({
      name: name,
      nic: nic,
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

//Get All Customers
async function getAllCustomers() {
  try {
    const customers = await Customers.findAll();

    if (!customers) {
      return {
        error: true,
        status: 404,
        payload: "No customers found!",
      };
    } else {
      return {
        error: false,
        status: 200,
        payload: customers,
      };
    }
  } catch (error) {
    console.error("Error getting all customers Service : ", error);
    throw error;
  }
}

//Get Customer By ID
async function getCustomerById(id) {
  try {
    const customer = await Customers.findByPk(id);

    if (!customer) {
      return {
        error: true,
        status: 404,
        payload: "Customer not found!",
      };
    } else {
      return {
        error: false,
        status: 200,
        payload: customer,
      };
    }
  } catch (error) {
    console.error("Error getting customer by id Service : ", error);
    throw error;
  }
}

//Update Customer
async function updateCustomer(id, customerData) {
  try {
    const customer = await Customers.findByPk(id);

    if (!customer) {
      return {
        error: true,
        status: 404,
        payload: "Customer not found!",
      };
    } else {
      await customer.update(customerData);

      return {
        error: false,
        status: 200,
        payload: "Customer successfully updated!",
      };
    }
  } catch (error) {
    console.error("Error updating customer Service : ", error);
    throw error;
  }
}

//Delete Customer
async function deleteCustomer(id) {
  try {
    const customer = await Customers.findByPk(id);

    if (!customer) {
      return {
        error: true,
        status: 404,
        payload: "Customer not found!",
      };
    } else {
      await customer.destroy();

      return {
        error: false,
        status: 200,
        payload: "Customer successfully deleted!",
      };
    }
  } catch (error) {
    console.error("Error deleting customer Service : ", error);
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
