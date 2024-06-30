const itemsService = require("../service/items.service");

async function createItems(req, res) {
  try {
    const userRole_id = req.user.roleId;
    const items = req.body;
    items.userId = req.user.id;

    if (![1].includes(userRole_id)) {
      return res.status(403).json({
        error: true,
        payload: "Unauthorized. Only Admins can create agencies.",
      });
    }

    const result = await itemsService.createItem(items);

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
    console.error("Error creating Items controller: ", error);
    return res.status(500).json({
      error: true,
      payload: "An error occurred while creating items.",
    });
  }
}

module.exports = {
  createItems,
};
