const userService = require("../service/user.service");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

//Register User
async function registerUser(req, res) {
  try {
    const userRole_id = req.user.roleId;
    const { name, email, contactNo, address, username, password, roleId } =
      req.body;
    console.log(
      "Register:",
      name,
      email,
      contactNo,
      address,
      username,
      password,
      roleId
    );
    if (![1].includes(userRole_id)) {
      return res.status(403).json({
        error: true,
        payload: "Unauthorized! Only Admins can create users.",
      });
    }

    if (
      !(name && email && contactNo && address && username && password && roleId)
    ) {
      return res.status(400).json({
        error: true,
        payload: "All fields are required.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await userService.registerUser(
      name,
      email,
      contactNo,
      address,
      username,
      hashPassword,
      roleId
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

//Login User
async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    const user = await userService.loginUser(username);

    if (!user) {
      return res.json({
        error: true,
        payload: "User Doesn't Exist",
      });
    } else {
      bcrypt.compare(password, user.password).then(async (match) => {
        if (!match) {
          res.status(400).json({
            error: true,
            payload: "Wrong Username And Password Combination",
          });
        } else {
          const accessToken = sign(
            {
              username: user.username,
              id: user.id,
              roleId: user.roleId,
            },
            "importantsecret"
          );
          res.status(200).json({
            error: false,
            payload: {
              accessToken: accessToken,
              roleId: user.roleId,
            },
          });
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      payload: error,
    });
  }
}

//Get User Roles
async function getUserRoles(req, res) {
  try {
    console.log("Getting");
    const result = await userService.getUserRoles();

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
    console.log("Error Getting User Roles Controller", error);
    return res.status(500).json({
      error: true,
      payload: error,
    });
  }
}

// Get All Users
async function getAllUsers(req, res) {
  try {
    const userRole_id = req.user.roleId;

    if (![1].includes(userRole_id)) {
      return res.status(403).json({
        error: true,
        payload: "Unauthorized! Only Admins can view users.",
      });
    }

    const result = await userService.getAllUsers();

    if (result.error) {
      return res.status(result.status).json({
        error: true,
        payload: result.payload,
      });
    } else {
      const transformedPayload = result.payload.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        contactNo: user.contactNo,
        address: user.address,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        roleId: user.roleId,
        role: user.roles.role,
      }));

      return res.status(result.status).json({
        error: false,
        payload: transformedPayload,
      });
    }
  } catch (err) {
    console.log("Error Getting Users Controller: ", err);
    return res.status(500).json({
      error: true,
      payload: err,
    });
  }
}

//get user by id
async function getUserById(req, res) {
  try {
    const userRole_id = req.user.roleId;
    const { id } = req.params;

    if (![1].includes(userRole_id)) {
      return res.status(403).json({
        error: true,
        payload: "Unauthorized! Only Admins can view users.",
      });
    }

    const result = await userService.getUserById(id);

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
    console.log("Error Getting Users Controller: ", error);
    return res.status(500).json({
      error: true,
      payload: error,
    });
  }
}

//Update User
async function updateUser(req, res) {
  try {
    const userRole_id = req.user.roleId;
    const { id } = req.params;
    const userData = req.body;

    delete userData.password;

    if (![1].includes(userRole_id)) {
      return res.status(403).json({
        error: true,
        payload: "Unauthorized! Only Admins can update users.",
      });
    }

    const result = await userService.updateUser(id, userData);

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
    console.log("Error Updating User Controller: ", error);
    return res.status(500).json({
      error: true,
      payload: error,
    });
  }
}

// Delete User
async function deleteUser(req, res) {
  try {
    const userRole_id = req.user.roleId;
    const { id } = req.params;

    if (![1].includes(userRole_id)) {
      return res.status(403).json({
        error: true,
        payload: "Unauthorized! Only Admins can delete users.",
      });
    }

    const result = await userService.deleteUser(id);

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
    console.log("Error Deleting User Controller: ", error);
    return res.status(500).json({
      error: true,
      payload: error,
    });
  }
}

//Get Signed User
async function getSignedUser(req, res) {
  try {
    const id = req.user.id;

    const result = await userService.getUserById(id);

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
    console.log("Error Getting Signed User Controller: ", error);
    return res.status(500).json({
      error: true,
      payload: error,
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserRoles,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getSignedUser,
};
