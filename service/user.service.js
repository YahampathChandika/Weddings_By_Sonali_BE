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
    console.error("Error creating User Service : ", error);
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

//GetUserRoles
async function getUserRoles() {
  try {
    const roles = await Roles.findAll();

    if (!roles) {
      return {
        error: true,
        status: 404,
        payload:
          "No User Roles Available. Please Create User Roles In The Database.",
      };
    } else {
      return {
        error: false,
        status: 200,
        payload: roles,
      };
    }
  } catch (error) {
    console.error("Error Getting User Roles Service : ", error);
    throw error;
  }
}

//GetAllUsers
async function getAllUsers() {
  try {
    const users = await Users.findAll({
      attributes: {
        exclude: ["password"],
      },
      include: {
        model: Roles,
        as: "roles",
        attributes: ["role"],
      },
    });

    if (!users) {
      return {
        error: true,
        status: 404,
        payload: "No Users Available",
      };
    } else {
      return {
        error: false,
        status: 200,
        payload: users,
      };
    }
  } catch (error) {
    console.error("Error Getting All Users Service : ", error);
    throw error;
  }
}

//Get User By Id
async function getUserById(id) {
  try {
    const user = await Users.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
      include: {
        model: Roles,
        as: "roles",
        attributes: ["role"],
      },
    });

    if (!user) {
      return {
        error: true,
        status: 404,
        payload: "User Doesn't Exist!",
      };
    } else {
      return {
        error: false,
        status: 200,
        payload: user,
      };
    }
  } catch (error) {
    console.error("Error Getting User Service : ", error);
    throw error;
  }
}

//Update User
async function updateUser(id, userData) {
  try {
    const user = await Users.findByPk(id);

    if (!user) {
      return {
        error: true,
        status: 404,
        payload: "User Doesn't Exist!",
      };
    } else {
      const update = await user.update(userData);

      return {
        error: false,
        status: 200,
        payload: "User Successfullly Updated!",
      };
    }
  } catch (error) {
    console.error("Error Getting User Service : ", error);
    throw error;
  }
}

//Delete User

async function deleteUser(id) {
  try {
    const user = await Users.findByPk(id);

    if (!user) {
      return {
        error: true,
        status: 404,
        payload: "User Doesn't Exist!",
      };
    } else {
      await user.destroy();
      return {
        error: false,
        status: 200,
        payload: "User Successfully Deleted!",
      };
    }
  } catch (error) {
    console.error("Error Deleting User Service : ", error);
    throw error;
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
};
