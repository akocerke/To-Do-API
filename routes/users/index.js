// routes/users/index.js
const { Router } = require('express');
const  User  = require('../../database/models/users/User');
const UsersRouter = Router();
const logger = require('../../services/logger');
const bcrypt = require('bcryptjs');

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

// PUT /username - Benutzer seinen Benutzernamen ändern
UsersRouter.put('/username', async (req, res) => {
  const { newUsername } = req.body; // Neuer Benutzername aus dem Body

  // Überprüfen, ob der neue Benutzername im Body enthalten ist
  if (!newUsername) {
    return res.status(400).json({ message: 'Neuer Benutzername ist erforderlich' });
  }

  const userId = req.user.id; // Benutzer-ID aus dem Header-Token (authentifizierter Benutzer)

  try {
    // 1. Überprüfen, ob der neue Benutzername bereits in der Datenbank existiert
    const existingUser = await User.findOne({
      where: {
        username: newUsername, // Überprüfen, ob der Benutzername bereits existiert
      },
    });

    // Wenn der Benutzername bereits existiert, Rückgabe einer Fehlermeldung
    if (existingUser) {
      return res.status(400).json({ message: 'Dieser Benutzername ist bereits vergeben' });
    }

    // 2. Den Benutzer anhand der Benutzer-ID finden und den Benutzernamen aktualisieren
    const user = await User.findOne({
      where: {
        id: userId, // Überprüfen, ob der Benutzer existiert und die gleiche ID hat
      },
    });

    // Überprüfen, ob der Benutzer gefunden wurde
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    // 3. Benutzername aktualisieren
    user.username = newUsername;

    // Speichern der Änderungen
    await user.save();

    // 4. Das Passwort aus der Antwort entfernen
    const userResponse = user.toJSON(); // Wandelt das Benutzerobjekt in ein einfaches JSON-Objekt um
    delete userResponse.password; // Entfernt das Passwort

    // Erfolgreiche Antwort
    res.status(200).json({ message: 'Benutzername erfolgreich aktualisiert', user: userResponse });

    // Logger
    logger.info(`PUT /username - UserID: ${userId} - Benutzername erfolgreich geändert`);
  } catch (error) {
    // Fehlerbehandlung und Protokollierung
    logger.error(`PUT /username - UserID: ${userId} - Fehler beim Ändern des Benutzernamens: ${error.message}`);
    console.error('Fehler beim Ändern des Benutzernamens:', error);
    res.status(500).json({ message: 'Fehler beim Ändern des Benutzernamens' });
  }
});

// PUT /email - Benutzer seine E-Mail-Adresse ändern
UsersRouter.put('/email', async (req, res) => {
  const { newEmail } = req.body; // Neue E-Mail-Adresse aus dem Body

  // Überprüfen, ob die neue E-Mail im Body enthalten ist
  if (!newEmail) {
    return res.status(400).json({ message: 'Neue E-Mail-Adresse ist erforderlich' });
  }

  const userId = req.user.id; // Benutzer-ID aus dem Header-Token (authentifizierter Benutzer)

  try {
    // 1. Überprüfen, ob die neue E-Mail bereits in der Datenbank existiert
    const existingUser = await User.findOne({
      where: {
        email: newEmail, // Überprüfen, ob die E-Mail bereits existiert
      },
    });

    // Wenn die E-Mail bereits existiert, Rückgabe einer Fehlermeldung
    if (existingUser) {
      return res.status(400).json({ message: 'Diese E-Mail-Adresse ist bereits vergeben' });
    }

    // 2. Den Benutzer anhand der Benutzer-ID finden und die E-Mail-Adresse aktualisieren
    const user = await User.findOne({
      where: {
        id: userId, // Überprüfen, ob der Benutzer existiert und die gleiche ID hat
      },
    });

    // Überprüfen, ob der Benutzer gefunden wurde
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    // 3. E-Mail-Adresse aktualisieren
    user.email = newEmail;

    // Speichern der Änderungen
    await user.save();

    // 4. Das Passwort aus der Antwort entfernen
    const userResponse = user.toJSON(); // Wandelt das Benutzerobjekt in ein einfaches JSON-Objekt um
    delete userResponse.password; // Entfernt das Passwort

    // Erfolgreiche Antwort
    res.status(200).json({ message: 'E-Mail-Adresse erfolgreich aktualisiert', user: userResponse });

    // Logger
    logger.info(`PUT /email - UserID: ${userId} - E-Mail-Adresse erfolgreich geändert`);
  } catch (error) {
    // Fehlerbehandlung und Protokollierung
    logger.error(`PUT /email - UserID: ${userId} - Fehler beim Ändern der E-Mail-Adresse: ${error.message}`);
    console.error('Fehler beim Ändern der E-Mail-Adresse:', error);
    res.status(500).json({ message: 'Fehler beim Ändern der E-Mail-Adresse' });
  }
});

// PUT /password - Benutzer sein Passwort ändern
UsersRouter.put('/password', async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body; // Alte und neue Passwörter aus dem Body

  // Überprüfen, ob alle Felder vorhanden sind
  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'Alle Felder (altes Passwort, neues Passwort und Bestätigung) sind erforderlich' });
  }

  // Überprüfen, ob das neue Passwort und die Bestätigung übereinstimmen
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Das neue Passwort und die Bestätigung stimmen nicht überein' });
  }

  const userId = req.user.id; // Benutzer-ID aus dem Header-Token (authentifizierter Benutzer)

  try {
    // 1. Benutzer anhand der ID finden
    const user = await User.findOne({
      where: { id: userId },
    });

    // Überprüfen, ob der Benutzer existiert
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    // 2. Überprüfen, ob das alte Passwort korrekt ist
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Das alte Passwort ist falsch' });
    }

    // 3. Validierung des neuen Passworts (optional)
    // Hier könntest du zusätzliche Regeln für das neue Passwort hinzufügen, wie z. B. Mindestlänge oder Komplexität.

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Das neue Passwort muss mindestens 8 Zeichen lang sein' });
    }

    // 4. Hashen des neuen Passworts mit bcrypt
    const salt = await bcrypt.genSalt(10); // Generieren des Salts
    const hashedPassword = await bcrypt.hash(newPassword, salt); // Hashen des neuen Passworts

    // 5. Speichern des neuen Passworts in der Datenbank
    user.password = hashedPassword;
    await user.save();

    // Erfolgreiche Antwort
    res.status(200).json({ message: 'Passwort erfolgreich geändert' });

    // Logger
    logger.info(`PUT /password - UserID: ${userId} - Passwort erfolgreich geändert`);
  } catch (error) {
    // Fehlerbehandlung und Protokollierung
    logger.error(`PUT /password - UserID: ${userId} - Fehler beim Ändern des Passworts: ${error.message}`);
    console.error('Fehler beim Ändern des Passworts:', error);
    res.status(500).json({ message: 'Fehler beim Ändern des Passworts' });
  }
});



module.exports = { UsersRouter };
