module.exports = (sequelize, DataTypes) => {
  const Items = sequelize.define("Items", {
    itemName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    usedTimes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    demage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    missing: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
      allowNull: true,
    }

  });
  return Items;
};
