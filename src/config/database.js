"use strict";

const Sequelize = require("sequelize");
const dbConfig = require("../database/config/auth");

const config = dbConfig[process.env.NODE_ENV || "development"];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
    }
);

module.exports = sequelize;