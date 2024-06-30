module.exports = (sequelize, DataTypes) => {
  const Items = sequelize.define("Items", {
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    usedTimes: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    demage: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    missing: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    }
  });
  return Items;
};
