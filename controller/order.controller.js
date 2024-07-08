const orderService = require("../service/order.service");

async function createOrder(req, res) {
  try {
    const order = req.body;

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

async function getAllOrders(req, res) {
  try {
    const result = await orderService.getAllOrders();

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
    console.log("Error fetching orders: ", error);
    return res.status(500).json({
      error: true,
      payload: error.message,
    });
  }
}

async function getOrderById(req, res) {
  try {
    const { id } = req.params;

    const result = await orderService.getOrderById(id);

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
    console.log("Error getting order: ", error);
    return res.status(500).json({
      error: true,
      payload: error.message,
    });
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
};
