// index.js
require('dotenv').config();
const { AppRouter } = require('./routes');
const express = require('express');
const logger = require('./services/logger');
const sequelize = require('./database/setup/database');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware einrichten
app.use(cors());
app.use(bodyParser.json());

// Verwende AppRouter für alle API-Routen
app.use('/todo-api', AppRouter);

// Überprüfe die Verbindung zur Datenbank, bevor der Server startet
if (require.main === module) {
  sequelize
    .authenticate()
    .then(() => {
      logger.info('Datenbankverbindung erfolgreich hergestellt.');
      // Jetzt startet der Server, wenn die Verbindung erfolgreich ist
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        logger.info(`API läuft auf Port ${PORT}`);
      });
    })
    .catch((err) => {
      logger.error('Datenbankverbindung konnte nicht hergestellt werden:', err);
      // Prozess mit Fehlercode 1 beenden
      process.exit(1);
    });
}
