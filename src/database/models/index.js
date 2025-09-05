const Sequelize = require("sequelize");
const sequelize = require("../../config/database");

const db = {};

db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.Todo = require("./Todo")(sequelize, Sequelize.DataTypes);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

async function initializedatabase() {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");

        await sequelize.sync({ force: false });
        console.log("All models were synchronized successfully.");
    } catch (err) {
        console.error("Unable to connect to database:", err);
    }
} 

initializedatabase();

module.exports = db;