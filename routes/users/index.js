// routes/users/index.js
const { Router } = require('express');
const  User  = require('../../database/models/users/User');
const UsersRouter = Router();

// GET /all - Gibt alle Benutzer zurück
UsersRouter.get('/all', async (req, res) => {
  try {
    // Alle Benutzer aus der Datenbank abrufen
    const users = await User.findAll();
    
    // Antwort zurückgeben
    res.status(200).json(users);
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Benutzer' });
  }
});

module.exports = { UsersRouter };
