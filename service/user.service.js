const { Users, Roles } = require("../models");

//Register User
async function registerUser(
  name,
  email,
  contactNo,
  address,
  username,
  hashPassword,
  roleId
) {
  try {
    const usernameExist = await Users.findOne({
      where: {
        username: username,
      },
    });

    const emailExist = await Users.findOne({
      where: {
        email: email,
      },
    });

    if (usernameExist) {
      return {
        error: true,
        status: 409,
        payload: "Sorry, that username already exists!",
      };
    }

    if (emailExist) {
      return {
        error: true,
        status: 409,
        payload: "Sorry, that email already exists!",
      };
    }

    const role = await Roles.findByPk(roleId);

    if (!role) {
      return {
        error: true,
        status: 404,
        payload: "Role not found!",
      };
    }

    const newUser = await Users.create({
      name: name,
      email: email,
      contactNo: contactNo,
      address: address,
      username: username,
      password: hashPassword,
      roleId: roleId,
    });

    return {
      error: false,
      status: 200,
      payload: "User Successfully Created",
    };
  } catch (error) {
    console.log("Error creating User Service : ", error);
    throw error;
  }
}

//Login User

async function loginUser(username) {
  try {
    const user = await Users.findOne({
      where: {
        username: username,
      },
      include: {
        model: Roles,
        as: "roles",
        attributes: ["role"],
      },
    });
    return user;
    
  } catch (error) {
    console.error("Error Login In User Service : ", error);
    throw error;
  }
}

module.exports = {
  registerUser,
  loginUser,
  // getUserRoles,
  // getAllUsers,
  // getUserById,
  // updateUser,
  // deleteUser
};
