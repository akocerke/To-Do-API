// routes/auth/index.js
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const logger = require('../../services/logger');
const User = require('../../database/models/users/User');
const { generateToken } = require('../../services/auth/AccessToken');
const { verifyToken } = require('../../services/auth/AccessToken');

const AuthRouter = Router();

// Login-Route
AuthRouter.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Überprüfen, ob das identifier-Feld eine E-Mail ist
    const isEmail = identifier.includes('@');

    // Suche nach dem Benutzer basierend auf E-Mail oder Benutzername
    const user = await User.findOne({
      where: isEmail ? { email: identifier } : { username: identifier }
    });

    // Wenn der Benutzer nicht gefunden wird, Fehlermeldung zurückgeben
    if (!user) {
      return res.status(401).json({ message: 'Benutzer nicht gefunden' });
    }

    // Vergleiche das Passwort
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Ungültige Anmeldeinformationen' });
    }

    // JWT-Token generieren
    const token = generateToken({ id: user.id });

    // Erfolgreiches Login zurückgeben
    res.status(200).json({
      message: 'Login erfolgreich',
      user: {
        id: user.id,
      },
      token, // Hier den Token zurückgeben
    });

    // Logge den erfolgreichen Login-Versuch
    logger.info(`Benutzer mit ID ${user.id} Login erfolgreich.`);
  } catch (error) {
    logger.error('Fehler beim Login:', error);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

// Signup-Route
AuthRouter.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Überprüfe, ob die E-Mail bereits vorhanden ist
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'E-Mail bereits registriert' });
    }

    // Überprüfe, ob der Benutzername bereits vorhanden ist
    const existingUserByUsername = await User.findOne({ where: { username } });
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'Benutzername bereits vergeben' });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Neuen Benutzer erstellen
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'user', // Standard-Rolle für neue Benutzer
    });

    // Erfolgreiche Registrierung protokollieren
    logger.info(
      `Benutzer erfolgreich registriert: ID ${newUser.id}, Benutzername ${newUser.username}`
    );

    // Erfolgreiche Registrierung zurückgeben
    res.status(201).json({
      message: 'Benutzer erfolgreich registriert',
    });
  } catch (error) {
    logger.error('Fehler bei der Registrierung:', error);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

// Logout-Route
AuthRouter.post('/logout', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    logger.error('Token nicht nicht erhalten für logout');
    return res.status(401).json({ message: 'Token nicht nicht erhalten' });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      logger.error('Ungültiges oder abgelaufenes Token für logout');
      return res
        .status(401)
        .json({ message: 'Ungültiges oder abgelaufenes Token' });
    }

    // Optional: Implementiere hier die Logik zur Invalidierung des Tokens, falls erforderlich.

    // Logge den erfolgreichen Logout-Versuch
    logger.info(`User mit ID ${decoded.id} Logout erfolgreich`);

    res.status(200).json({ message: 'Logout erfolgreich' });
  } catch (error) {
    logger.error('Error during logout:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = { AuthRouter };
