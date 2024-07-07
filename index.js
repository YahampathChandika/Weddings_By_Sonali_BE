const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const db = require("./models");

// Routers
const routes = require("./routes/index.routes");
app.use("/", routes);

//static Images Folder

app.use("/Images", express.static("./Images"));

try {
  db.Users.belongsTo(db.Roles, { as: "roles", foreignKey: "roleId", onDelete: "cascade"});
  db.Roles.hasMany(db.Users, { as: "users", foreignKey: "roleId", onDelete: "cascade"});
  
  db.ItemsUsage.belongsTo(db.Items, { as: "items", foreignKey: "itemID"});
  db.Items.hasMany(db.ItemsUsage, { as: "itemsUsage", foreignKey: "itemID"});

  db.Events.belongsTo(db.Customers, { as: "customer", foreignKey: "customerId"});
  db.Customers.hasMany(db.Events, { as: "events", foreignKey: "customerId", onDelete: "cascade" });

  db.ItemsUsage.belongsTo(db.Events, { as: "events", foreignKey: "eventID"});
  db.Events.hasMany(db.ItemsUsage, { as: "itemsUsage", foreignKey: "eventID"});

} catch (error) {
    console.log(error);
}

db.sequelize.sync({ alter: true }).then(() => {
  app.listen(4002, () => {
    console.log(`SERVER RUNNING ON PORT 4002`);
  });
});