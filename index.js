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

// try {
//     db.Users.belongsTo(db.Roles, { as: "roles", foreignKey: "roleId", onDelete: "cascade"});
//     db.Roles.hasMany(db.Users, { as: "users", foreignKey: "roleId", onDelete: "cascade"});
//     db.Tests.belongsTo(db.Users, {as: "user", foreignKey: "userId"});
//     db.Users.hasMany(db.Tests, {as: "tests", foreignKey: "userId"});
//     db.Agencies.belongsTo(db.Users, {as: "user", foreignKey: "userId"});
//     db.Users.hasMany(db.Agencies, {as: "agencies", foreignKey: "userId"});

//     db.Customers.belongsTo(db.Agencies, {as: "agency", foreignKey: "agencyId"});
//     db.Agencies.hasMany(db.Customers, {as: "customers", foreignKey: "agencyId"});
//     db.Customers.belongsTo(db.Countries, {as: "country", foreignKey: "countryId"});
//     db.Countries.hasMany(db.Customers, {as: "customers", foreignKey: "countryId"});
//     db.Customers.belongsTo(db.Jobs, {as: "job", foreignKey: "jobId"});
//     db.Jobs.hasMany(db.Customers, {as: "customers", foreignKey: "jobId"});
//     db.DropdownData.belongsTo(db.Dropdowns, {as: "dropdown", foreignKey: "dropdownId", onDelete: "cascade"});
//     db.Dropdowns.hasMany(db.DropdownData, {as: "dropdownData", foreignKey: "dropdownId", onDelete: "cascade"});

//     db.Packages.belongsToMany(db.Tests, {through: "PackageTests", foreignKey: "pkgId", onDelete: "cascade"});
//     db.Tests.belongsToMany(db.Packages, {through: "PackageTests", foreignKey: "testId", onDelete: "cascade"});

//     db.Admissions.belongsTo(db.Customers, {as: "customer", foreignKey: "customerId", onDelete: "cascade"})
//     db.Customers.hasMany(db.Admissions, {as: "admissions", foreignKey: "customerId", onDelete: "cascade"});

//     db.Admissions.belongsTo(db.DropdownData, {as: "bank", foreignKey: "bankId"});
//     db.DropdownData.hasMany(db.Admissions, {as: "bank_admission", foreignKey: "bankId"});
//     db.Admissions.belongsTo(db.DropdownData, {as: "creditAprover", foreignKey: "creditAproverId"});
//     db.DropdownData.hasMany(db.Admissions, {as: "creditAprover_admission", foreignKey: "creditAproverId"});
//     db.Admissions.belongsTo(db.DropdownData, {as: "miniLabStatus", foreignKey: "miniLabStatusId"});
//     db.DropdownData.hasMany(db.Admissions, {as: "miniLabStatus_admission", foreignKey: "miniLabStatusId"});
//     db.Admissions.belongsTo(db.DropdownData, {as: "labStatus", foreignKey: "labStatusId"});
//     db.DropdownData.hasMany(db.Admissions, {as: "labStatus_admission", foreignKey: "labStatusId"});
//     db.Admissions.belongsTo(db.DropdownData, {as: "xRayStatus", foreignKey: "xRayStatusId"});
//     db.DropdownData.hasMany(db.Admissions, {as: "xRayStatus_admission", foreignKey: "xRayStatusId"});
//     db.Admissions.belongsTo(db.DropdownData, {as: "paymentMethod", foreignKey: "paymentMethodId"});
//     db.DropdownData.hasMany(db.Admissions, {as: "paymentMethod_admission", foreignKey: "paymentMethodId"})

//     db.CustomerTests.belongsTo(db.Customers, {as: "customer", foreignKey: "customerId", onDelete: "cascade"});
//     db.Customers.hasMany(db.CustomerTests, {as: "customerTests", foreignKey: "customerId", onDelete: "cascade"});
//     db.CustomerTests.belongsTo(db.Tests, {as: "test", foreignKey: "testId", onDelete: "cascade"});
//     db.Tests.hasMany(db.CustomerTests, {as: "customerTests", foreignKey: "testId", onDelete: "cascade"});

//     db.CustomerTests.belongsTo(db.Packages, {as: "package", foreignKey: "packageId", onDelete: "cascade"});
//     db.Packages.hasMany(db.CustomerTests, {as: "customerTests", foreignKey: "packageId", onDelete: "cascade"});

//     db.CustomerTests.belongsTo(db.Admissions, {as: "admission", foreignKey: "admissionId", onDelete: "cascade"});
//     db.Admissions.hasMany(db.CustomerTests, {as: "customerTests", foreignKey: "admissionId", onDelete: "cascade"});

//     db.CustomerPackages.belongsTo(db.Admissions, {as:"admission", foreignKey:"admissionId", onDelete: "cascade"});
//     db.Admissions.hasMany(db.CustomerPackages, {as: "customerPackages", foreignKey:"admissionId", onDelete: "cascade"})
//     db.CustomerPackages.belongsTo(db.Customers, {as:"customer", foreignKey:"customerId", onDelete: "cascade"});
//     db.Customers.hasMany(db.CustomerPackages, {as: "customerPackages", foreignKey:"customerId", onDelete: "cascade"})
//     db.CustomerPackages.belongsTo(db.Packages, {as:"package", foreignKey:"packageId", onDelete: "cascade"});
//     db.Packages.hasMany(db.CustomerPackages, {as: "customerPackages", foreignKey:"packageId", onDelete: "cascade"})

// } catch (error) {
//     console.log(error);
// }

db.sequelize.sync({ alter: true }).then(() => {
  app.listen(4002, () => {
    console.log(`SERVER RUNNING ON PORT 4002`);
  });
});
