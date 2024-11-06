// database/setup/database.js
const { Sequelize } = require('sequelize');

// Lade die Umgebungsvariablen
const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST } = process.env;

// Verbindung zur MySQL-Datenbank herstellen
const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  dialect: 'mysql',
  host: DB_HOST,
  define: {
    // Deaktiviere die Standardzeitstempel (createdAt und updatedAt)
    timestamps: false,
  },
  dialectOptions: {
    charset: 'utf8mb4', // Stelle sicher, dass die Kodierung übereinstimmt
  },
});

// Exportieren der Sequelize-Verbindung
module.exports = sequelize;
