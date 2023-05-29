const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Groups = sequelize.define('groups',{
    
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    name : Sequelize.STRING,
    adminId : Sequelize.INTEGER
});

module.exports = Groups;