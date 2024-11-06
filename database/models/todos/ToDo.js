// database/models/todos/ToDo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../setup/database');
const User = require('../users/User');

const ToDo = sequelize.define('ToDo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Verweist auf das User-Modell
      key: 'id',
    },
    onDelete: 'CASCADE', // Wenn der User gelöscht wird, werden auch alle zugehörigen ToDos gelöscht
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('offen', 'in Bearbeitung', 'abgeschlossen'),
    defaultValue: 'offen',
  },
  is_important: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'todos',
  timestamps: false, // Setzt die Timestamps manuell
});

ToDo.belongsTo(User, { foreignKey: 'user_id' }); // Definiert die Beziehung zu User

module.exports = ToDo;
