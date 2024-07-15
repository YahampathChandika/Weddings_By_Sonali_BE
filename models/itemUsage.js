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
  });
  return ItemsUsage;
};
