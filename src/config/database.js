"use strict";

const Sequelize = require("sequelize");
const dbConfig = require("../database/config/auth");

const config = dbConfig[process.env.NODE_ENV] || dbConfig.development;

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        logging: false,
    }
);

module.exports = sequelize;