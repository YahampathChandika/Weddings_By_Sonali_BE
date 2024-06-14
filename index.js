const express = require("express");
const app = express();
const cors = require("cors");
const dotEnv = require("dotenv");

dotEnv.config();

const PORT = process.env.PORT || 4200;
const HOST = process.env.HOST || "127.0.0.1";
app.use(express.json());
app.use(cors());

const db = require("./models");

// Routers
const routes = require("./routes/index.routes");
app.use("/", routes);

//static Images Folder
// app.use('/images', express.static('./images'))

// try {

//     db.Admissions.belongsTo(db.Patients, { as: "patients", foreignKey: "PatientId", onDelete: 'cascade'});
//     db.Patients.hasMany(db.Admissions, { as: "admissions", foreignKey: "PatientId"});
//     db.VitalSigns.belongsTo(db.Patients, { as: "patients", foreignKey: "PatientId"});
//     db.Patients.hasMany(db.VitalSigns, { as: "vital_signs", foreignKey: "PatientId"});
//     db.Users.belongsTo(db.UserRoles, { as: "roles", foreignKey: "roleId"});
//     db.UserRoles.hasMany(db.Users, {as: "users", foreignKey: "roleId"});
//     db.Admissions.belongsTo(db.Beds, {as: "bed", foreignKey: "bedId"});
//     db.Beds.hasMany(db.Admissions, {as: "admissions", foreignKey: "bedId"});

//     db.Conditions.belongsTo(db.Patients, { as: "patients", foreignKey: "PatientId"});
//     db.Patients.hasMany(db.Conditions, { as: "conditions", foreignKey: "PatientId"});

//     db.CriticalAlerts.belongsTo(db.Patients, { as: "patients", foreignKey: "PatientId"});
//     db.Patients.hasMany(db.CriticalAlerts, { as: "criticalAlerts", foreignKey: "PatientId"});

//     db.BorderlineAlerts.belongsTo(db.Patients, { as: "patients", foreignKey: "PatientId"});
//     db.Patients.hasMany(db.BorderlineAlerts, { as: "borderlineAlerts", foreignKey: "PatientId"});

// } catch (error) {
//     console.log(error);
// }

db.sequelize.sync({ alter: true }).then(() => {
  // app.listen(PORT, () => {
  //     console.log("SERVER RUNNING ON PORT 4200");
  // });

  app.listen(PORT, HOST, () =>
    console.log(`Server running on ${PORT}`)
  );
});
