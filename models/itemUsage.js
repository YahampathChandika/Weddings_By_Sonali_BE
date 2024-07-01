module.exports = (sequelize, DataTypes) => {
    const ItemsUsage = sequelize.define("ItemsUsage", {
      quantity: {
        type: DataTypes.STRING,
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
    });
    return ItemsUsage;
  };
  