module.exports = (sequelize, DataTypes) => {
  const ItemsUsage = sequelize.define("ItemsUsage", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    returned: {
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
    isSelect: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    needsWash: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    isWashed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  });
  return ItemsUsage;
};
