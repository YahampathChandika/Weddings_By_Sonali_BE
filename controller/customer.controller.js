const customerService = require("../service/customer.service");

//Register Customer
async function registerCustomer(req, res) {
  try {
    const userRole_id = req.user.roleId;
    const { name, nic, contactNo, address } = req.body;

    if (![1].includes(userRole_id)) {
      return res.status(403).json({
        error: true,
        payload: "Unauthorized! Only Admins can register customers",
      });
    }

    if (!(name && nic && contactNo && address)) {
      return res.status(400).json({
        error: true,
        payload: "All fields are required.",
      });
    }

    const result = await customerService.registerCustomer(
      name,
      nic,
      contactNo,
      address
    );

    if (result.error) {
      return res.status(result.status).json({
        error: true,
        payload: result.payload,
      });
    } else {
      return res.status(result.status).json({
        error: false,
        payload: result.payload,
      });
    }
  } catch (error) {
    console.log("Error in customer controller: ", error);
    return res.status(500).json({
      error: true,
      payload: error,
    });
  }
}

//Get All Customers

async function getAllCustomers(req, res) {
  try {
    const result = await customerService.getAllCustomers();

    if (result.error) {
      return res.status(result.status).json({
        error: true,
        payload: result.payload,
      });
    } else {
      return res.status(result.status).json({
        error: false,
        payload: result.payload,
      });
    }
  } catch (error) {
    console.log("Error Getting customer Controller: ", error);
    return res.status(500).json({
      error: true,
      payload: error,
    });
  }
}

//Get Customer By ID
async function getCustomerById(req, res) {
  try {
    const { id } = req.params;
    const result = await customerService.getCustomerById(id);

    if (result.error) {
      return res.status(result.status).json({
        error: true,
        payload: result.payload,
      });
    } else {
      return res.status(result.status).json({
        error: false,
        payload: result.payload,
      });
    }
  } catch (error) {
    console.log("Error Getting customer Controller: ", error);
    return res.status(500).json({
      error: true,
      payload: error,
    });
  }
}

//Update Customer
async function updateCustomer(req, res) {
  try {
    const userRole_id = req.user.roleId;
    const { id } = req.params;
    const customerData = req.body;

    if (![1].includes(userRole_id)) {
      return res.status(403).json({
        error: true,
        payload: "Unauthorized. Only Admins can update customers.",
      });
    }

    const result = await customerService.updateCustomer(id, customerData);

    if (result.error) {
      return res.status(result.status).json({
        error: true,
        payload: result.payload,
      });
    } else {
      return res.status(result.status).json({
        error: false,
        payload: result.payload,
      });
    }
  } catch (error) {
    console.log("Error in customer controller: ", error);
    return res.status(500).json({
      error: true,
      payload: error,
    });
  }
}

//Delete Customer
async function deleteCustomer(req, res) {
  try {
    const userRole_id = req.user.roleId;
    const { id } = req.params;

    if (![1].includes(userRole_id)) {
      return res.status(403).json({
        error: true,
        payload: "Unauthorized! Only Admins can delete customers.",
      });
    }

    const result = await customerService.deleteCustomer(id);

    if (result.error) {
      return res.status(result.status).json({
        error: true,
        payload: result.payload,
      });
    } else {
      return res.status(result.status).json({
        error: false,
        payload: result.payload,
      });
    }
  } catch (error) {
    console.log("Error in customer controller: ", error);
    return res.status(500).json({
      error: true,
      payload: error,
    });
  }
}

module.exports = {
  registerCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
