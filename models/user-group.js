const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const UserGroups = sequelize.define('chatusers',{
    
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    }
});

module.exports = UserGroups;