const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('chatapp', 'root', 'abhay@26',{
    dialect : 'mysql',
    host : 'localhost'
});

 module.exports = sequelize;