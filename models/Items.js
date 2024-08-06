module.exports = (sequelize, DataTypes) => {
  const Items = sequelize.define("Items", {
    itemName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    usedTimes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    damaged: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    missing: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    availableunits: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    wash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return Items;
};
