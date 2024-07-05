// Ensure correct export
const orderService = require('../service/order.service');

async function createOrder(req, res) {
  try {
    const userRole_id = req.user.roleId;
    const order = req.body;
    order.userId = req.user.id;

    const result = await orderService.createNewOrder(order);

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
    console.log("Error creating order controller: ", error);
    return res.status(500).json({
      error: true,
      payload: error.message,
    });
  }
}

module.exports = {
    createOrder, // Ensure this matches the function name
};
