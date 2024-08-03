module.exports = (sequelize, DataTypes) => {
  const Customers = sequelize.define("Customers", {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return Customers;
};
