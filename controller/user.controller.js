const userService = require("../service/user.service");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

//Register User

async function registerUser(req, res) {
  try {
    const userRole_id = req.body.roleId;
    const { name, email, contactNo, address, username, password, roleId } =
      req.body;

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
module.exports = {
  registerUser,
  loginUser,
  // getUserRoles,
  // getAllUsers,
  // getUserById,
  // getSignedUser,
  // updateUser,
  // deleteUser
};
