// database/models/users/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../setup/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
}, {
  tableName: 'users', // Setzt den Tabellennamen
  timestamps: false,  // Keine automatische Erzeugung der Timestamps, weil du sie manuell definierst
});

module.exports = User;
