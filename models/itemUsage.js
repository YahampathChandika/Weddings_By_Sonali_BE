module.exports = (sequelize, DataTypes) => {
  const ItemsUsage = sequelize.define("ItemsUsage", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    damaged: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    missing: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isSelect: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return ItemsUsage;
};
