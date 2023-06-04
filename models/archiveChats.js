const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const ArchiveChats = sequelize.define('archivechats', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    chat: {
      type: Sequelize.STRING,
    },
    isImage: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    groupId: Sequelize.INTEGER,
    userId: Sequelize.INTEGER
  });

module.exports = ArchiveChats;