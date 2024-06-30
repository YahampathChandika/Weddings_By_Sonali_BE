const customerService = require("../service/customer.service");

//Register Customer
async function registerCustomer(req, res) {
  try {
    const userRole_id = req.body.roleId;
    const { name, email, contactNo, address } = req.body;

    if (![1].includes(userRole_id)) {
      return res.status(403).json({
        error: true,
        payload: "Unauthorized! Only Admins can register customers",
      });
    }

    if (!(name && email && contactNo && address)) {
      return res.status(400).json({
        error: true,
        payload: "All fields are required.",
      });
    }

    const result = await customerService.registerCustomer(
      user,
      name,
      email,
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
    console.log("Error in user controller: ", error);
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
