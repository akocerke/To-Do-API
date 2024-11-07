// routes/users/index.js
const { Router } = require('express');
const  User  = require('../../database/models/users/User');
const UsersRouter = Router();
const logger = require('../../services/logger');

// GET /all - Gibt alle Benutzer zurück Test-Route
// UsersRouter.get('/all', async (req, res) => {
//   try {
//     // Alle Benutzer aus der Datenbank abrufen
//     const users = await User.findAll();
    
//     // Antwort zurückgeben
//     res.status(200).json(users);
//   } catch (error) {
//     console.error('Fehler beim Abrufen der Benutzer:', error);
//     res.status(500).json({ message: 'Fehler beim Abrufen der Benutzer' });
//   }
// });


// GET /profile - Benutzerprofil abrufen
UsersRouter.get('/profile', async (req, res) => {
  try {
    const userId = req.user.id; // Benutzer-ID aus dem JWT-Token (authentifizierter Benutzer)

    // Den Benutzer in der Datenbank suchen
    const user = await User.findOne({
      where: { id: userId },  // Benutzer anhand der ID finden
      attributes: ['id', 'username', 'email', 'created_at', 'updated_at'], // Attribute, die zurückgegeben werden sollen
    });

    // Überprüfen, ob der Benutzer existiert
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    // Erfolgreiche Antwort mit den Benutzerdaten
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at, // Das Erstellungsdatum des Benutzers
      updated_at: user.updated_at  // Das Aktualisierungsdatum des Benutzers
    });

    // Logger
    logger.info(`GET /profile - UserID: ${userId} - Benutzerprofil erfolgreich abgerufen`);

  } catch (error) {
    // Fehlerbehandlung und Protokollierung
    logger.error(`GET /profile - UserID: ${userId} - Fehler beim Abrufen des Benutzerprofils: ${error.message}`);
    console.error('Fehler beim Abrufen des Benutzerprofils:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen des Benutzerprofils' });
  }
});

module.exports = { UsersRouter };
