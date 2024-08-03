const itemsService = require("../service/items.service");

async function createItems(req, res) {
  try {
    const userRole_id = req.user.roleId;
    const items = req.body;
    items.userId = req.user.id;

    // Add default values
    items.usedTimes = "0";
    items.damage = "0";
    items.missing = "0";

    if (![1].includes(userRole_id)) {
      return res.status(403).json({
        error: true,
        payload: "Unauthorized. Only Admins can create Items.",
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

//Get all items
async function getAllItems(req, res) {
  try {
    // const userRole_id = req.user.roleId;

    // if (![1].includes(userRole_id)) {
    //     return res.status(403).json({ error: true, payload: "Unauthorized. Only Admins can view items."});
    // }

    const result = await itemsService.getAllItems();

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
    console.log("Error creating Items controller: ", error);
    return res.status(500).json({
      error: true,
      payload: error,
    });
  }
}

//Get Items by Id
async function getItemsById(req, res) {
  try {
    const userRole_id = req.user.roleId;
    const { id } = req.params;

    // if (![1].includes(userRole_id)) {
    //     return res.status(403).json({ error: true, payload: "Unauthorized. Only Admins can view details of an Items."});
    // }

    const result = await itemsService.getItemById(id);

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
    console.log("Error creating Items controller: ", error);
    return res.status(500).json({
      error: true,
      payload: error,
    });
  }
}

//Delete an Items
async function deleteItems(req, res) {
  try {
    const userRole_id = req.user.roleId;
    const { id } = req.params;

    if (![1].includes(userRole_id)) {
      return res
        .status(403)
        .json({
          error: true,
          payload: "Unauthorized. Only Admins can view details of an Items.",
        });
    }

    const result = await itemsService.deleteItems(id);

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
    console.log("Error Deleting Items : ", error);
    return res.status(500).json({
      error: true,
      payload: error,
    });
  }
}

// Update an Item
async function updateItem(req, res) {
  try {
    const userRole_id = req.user.roleId;
    const { id } = req.params;

    const updatedData = req.body;

    delete updatedData.itemCode;

    if (![1].includes(userRole_id)) {
      return res
        .status(403)
        .json({
          error: true,
          payload: "Unauthorized. Only Admins can update details of an Item.",
        });
    }

    const result = await itemsService.updateItems(id, updatedData);

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
    console.log("Error Updating Item Controller: ", error);
    return res.status(500).json({
      error: true,
      payload: error,
    });
  }
}

module.exports = {
  createItems,
  getAllItems,
  getItemsById,
  deleteItems,
  updateItem,
};
