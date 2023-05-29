const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,{
    dialect : 'mysql',
    host : 'db-chatapp.cifvqdtplgqh.us-east-1.rds.amazonaws.com'
});

 module.exports = sequelize;