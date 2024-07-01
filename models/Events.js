module.exports = (sequelize, DataTypes) => {
  const Events = sequelize.define("Events", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Events;
};
