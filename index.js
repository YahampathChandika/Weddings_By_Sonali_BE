const express = require("express");
const app = express();
const cors = require("cors");
// const dotEnv = require("dotenv")

// dotEnv.config()

// const PORT = process.env.PORT || 4000;
// const HOST = process.env.HOST || "10.10.92.143"
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
  // db.Items.belongsTo(db.Items, { as: "customers", foreignKey: "agencyId" });

    
} catch (error) {
    console.log(error);
}

db.sequelize.sync({ alter: true }).then(() => {
  app.listen(4002, () => {
    console.log(`SERVER RUNNING ON PORT 4002`);
  });
});
