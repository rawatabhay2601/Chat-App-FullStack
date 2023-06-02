const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Chats = sequelize.define('chats',{
    
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    chat: Sequelize.STRING,
    isImage: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Chats;