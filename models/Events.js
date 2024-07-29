module.exports = (sequelize, DataTypes) => {
  const Events = sequelize.define("Events", {
    eventName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    eventDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    pax: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    eventTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    returnDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    releaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return Events;
};
