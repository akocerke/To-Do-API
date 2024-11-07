const { Router } = require('express');
const  ToDo  = require('../../database/models/todos/ToDo');
const logger = require('../../services/logger');
const TodosRouter = Router();

// GET /all - Gibt alle To-Dos eines Benutzers zurück
TodosRouter.get('/all', async (req, res) => {
  try {
    const todos = await ToDo.findAll({
      where: { user_id: req.user.id } // Annahme: 'user_id' ist der Spaltenname in der ToDo-Tabelle
    });

    // Überprüfen, ob To-Dos vorhanden sind
    if (todos.length === 0) {
      return res.status(404).json({ message: 'Keine To-Dos für diesen Benutzer gefunden' });
    }

    // Erfolgreiche Antwort mit den To-Dos
    res.status(200).json(todos);
    logger.info(`GET /todos/all - UserID: ${req.user.id} - To-Dos erfolgreich abgerufen`);
  } catch (error) {
    // Fehlerbehandlung und Protokollierung
    logger.error(`GET /todos/all - UserID: ${req.user.id} - Fehler beim Abrufen der To-Dos: ${error.message}`);
    console.error('Fehler beim Abrufen der ToDos:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der To-Dos' });
  }
});

// GET /important - Gibt alle wichtigen To-Dos eines Benutzers zurück
TodosRouter.get('/important', async (req, res) => {
  try {
    const todos = await ToDo.findAll({
      where: {
        user_id: req.user.id, // Benutzer-ID filtern
        is_important: true     // Nur wichtige To-Dos
      }
    });

    // Überprüfen, ob wichtige To-Dos vorhanden sind
    if (todos.length === 0) {
      return res.status(404).json({ message: 'Keine wichtigen To-Dos für diesen Benutzer gefunden' });
    }

    // Erfolgreiche Antwort mit den wichtigen To-Dos
    res.status(200).json(todos);
    logger.info(`GET /todos/important - UserID: ${req.user.id} - Wichtige To-Dos erfolgreich abgerufen`);
  } catch (error) {
    // Fehlerbehandlung und Protokollierung
    logger.error(`GET /todos/important - UserID: ${req.user.id} - Fehler beim Abrufen der wichtigen To-Dos: ${error.message}`);
    console.error('Fehler beim Abrufen der wichtigen ToDos:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der wichtigen To-Dos' });
  }
});

// POST /create - To-Do erstellen
TodosRouter.post('/create', async (req, res) => {
  const { title, description, status, is_important, due_date } = req.body; // Daten aus dem Request-Body

  // Überprüfen, ob der Titel und das Fälligkeitsdatum im Body enthalten sind
  if (!title) {
    return res.status(400).json({ message: 'Titel ist erforderlich' });
  }
  if (!due_date) {
    return res.status(400).json({ message: 'Fälligkeitsdatum ist erforderlich' });
  }

  // Überprüfen, ob das Fälligkeitsdatum in der Vergangenheit liegt
  const now = new Date();
  const dueDate = new Date(due_date);

  if (dueDate < now) {
    return res.status(400).json({ message: 'Fälligkeitsdatum darf nicht in der Vergangenheit liegen' });
  }

  try {
    const userId = req.user.id; // Benutzer-ID aus dem Token (bereitgestellt durch die Middleware)

    // Wenn is_important nicht angegeben wurde, wird es automatisch auf false gesetzt
    const newTodo = await ToDo.create({
      user_id: userId, // Benutzer-ID aus dem Token
      title,
      description,
      status: status || 'offen', // Standardwert 'offen', falls nicht angegeben
      is_important: is_important === undefined ? false : is_important, // Wenn nicht angegeben, ist es false
      due_date: due_date // Fälligkeitsdatum aus dem Request-Body
    });

    // Erfolgreiche Antwort mit neuem To-Do
    res.status(201).json({ message: 'To-Do erfolgreich erstellt', todo: newTodo });

    // Erfolgslog
    logger.info(`POST /todos/create - UserID: ${userId} - To-Do erfolgreich erstellt`);
  } catch (error) {
    // Fehlerlog
    logger.error(`POST /todos/create - UserID: ${req.user.id} - Fehler beim Erstellen des To-Dos: ${error.message}`);
    res.status(500).json({ message: 'Fehler beim Erstellen des To-Dos' });
  }
});


// PUT /update - To-Dos eines Benutzers aktualisieren
TodosRouter.put('/update', async (req, res) => {
  const { todoId, title, description, status, is_important, due_date } = req.body; // To-Do-Daten aus dem Body

  // Überprüfen, ob die ToDoId im Body enthalten ist
  if (!todoId) {
    return res.status(400).json({ message: 'To-Do ID fehlt' });
  }

  // Wenn ein `due_date` übergeben wird, überprüfen, ob es in der Vergangenheit liegt
  if (due_date) {
    const now = new Date();
    const dueDate = new Date(due_date);

    if (dueDate < now) {
      return res.status(400).json({ message: 'Fälligkeitsdatum darf nicht in der Vergangenheit liegen' });
    }
  }

  const userId = req.user.id; // Benutzer-ID aus dem Header-Token (authentifizierter Benutzer)

  try {
    // Das To-Do in der Datenbank anhand der To-Do-ID und Benutzer-ID suchen
    const todo = await ToDo.findOne({
      where: {
        id: todoId,
        user_id: userId, // Überprüft, ob der Benutzer das To-Do auch wirklich besitzt
      },
    });

    // Überprüfen, ob das To-Do existiert
    if (!todo) {
      return res.status(404).json({ message: 'To-Do nicht gefunden oder keine Berechtigung für dieses To-Do' });
    }

    // Das To-Do mit den neuen Daten aktualisieren
    todo.title = title || todo.title; // Falls kein neuer Titel übergeben wird, bleibt der alte
    todo.description = description || todo.description; // Falls keine neue Beschreibung übergeben wird, bleibt die alte
    todo.status = status || todo.status; // Falls kein neuer Status übergeben wird, bleibt der alte
    todo.is_important = is_important !== undefined ? is_important : todo.is_important; // Wenn 'is_important' nicht undefined ist, wird es aktualisiert
    todo.due_date = due_date || todo.due_date; // Wenn 'due_date' übergeben wird, wird es aktualisiert, andernfalls bleibt es unverändert

    // Speichern der Änderungen
    await todo.save();

    // Erfolgreiche Antwort
    res.status(200).json({ message: 'To-Do erfolgreich aktualisiert', todo });

    // Logger
    logger.info(`PUT /todos/update - UserID: ${userId} - To-Do mit ID ${todoId} erfolgreich aktualisiert`);
  } catch (error) {
    // Fehlerbehandlung und Protokollierung
    logger.error(`PUT /todos/update - UserID: ${userId} - Fehler beim Aktualisieren der To-Do: ${error.message}`);
    console.error('Fehler beim Aktualisieren des To-Dos:', error);
    res.status(500).json({ message: 'Fehler beim Aktualisieren des To-Dos' });
  }
});


// PUT /status - To-Do-Status eines Benutzers aktualisieren
TodosRouter.put('/status', async (req, res) => {
  const { todoId, status } = req.body; // To-Do-ID und der neue Status aus dem Body

  // Überprüfen, ob die ToDoId und der Status angegeben wurden
  if (!todoId || !status) {
    logger.error('To-Do ID oder Status fehlt');
    return res.status(400).json({ message: 'To-Do ID oder Status fehlt' });
  }

  // Überprüfen, ob der Status ein gültiger Wert ist
  const validStatuses = ['offen', 'in Bearbeitung', 'abgeschlossen'];
  if (!validStatuses.includes(status)) {
    logger.error('Ungültiger Status');
    return res.status(400).json({ message: 'Ungültiger Status' });
  }

  const userId = req.user.id; // Benutzer-ID aus dem Header-Token (authentifizierter Benutzer)

  try {
    // Das To-Do in der Datenbank anhand der To-Do-ID und Benutzer-ID suchen
    const todo = await ToDo.findOne({
      where: {
        id: todoId,
        user_id: userId, // Überprüft, ob der Benutzer das To-Do auch wirklich besitzt
      },
    });

    // Überprüfen, ob das To-Do existiert
    if (!todo) {
      logger.error(`To-Do mit ID ${todoId} nicht gefunden oder keine Berechtigung für dieses To-Do - UserID: ${userId}`);
      return res.status(404).json({ message: 'To-Do nicht gefunden oder keine Berechtigung für dieses To-Do' });
    }

    // Status des To-Dos aktualisieren
    todo.status = status;

    // Speichern der Änderungen
    await todo.save();

    // Erfolgreiche Antwort
    res.status(200).json({ message: 'Status erfolgreich aktualisiert', todo });

    // Logger für erfolgreiche Aktualisierung
    logger.info(`PUT /todos/status - UserID: ${userId} - Status von To-Do mit ID ${todoId} erfolgreich auf "${status}" aktualisiert`);
  } catch (error) {
    // Fehlerbehandlung und Protokollierung
    logger.error(`PUT /todos/status - UserID: ${userId} - Fehler beim Aktualisieren des Status für To-Do mit ID ${todoId}: ${error.message}`);
    console.error('Fehler beim Aktualisieren des Status:', error);
    res.status(500).json({ message: 'Fehler beim Aktualisieren des Status' });
  }
});

// DELETE /delete - To-Dos eines Benutzers löschen
TodosRouter.delete('/delete', async (req, res) => {
  const { todoId } = req.body; // To-Do-ID aus dem Body

  // Überprüfen, ob die ToDoId vorhanden ist
  if (!todoId) {
    return res.status(400).json({ message: 'To-Do ID fehlt' });
  }

  const userId = req.user.id; // Benutzer-ID aus dem Header-Token (authentifizierter Benutzer)

  try {
    // Das To-Do in der Datenbank anhand der To-Do-ID und Benutzer-ID suchen
    const todo = await ToDo.findOne({
      where: {
        id: todoId,
        user_id: userId, // Überprüft, ob der Benutzer das To-Do auch wirklich besitzt
      },
    });

    // Überprüfen, ob das To-Do existiert
    if (!todo) {
      return res.status(404).json({ message: 'To-Do nicht gefunden oder keine Berechtigung für dieses To-Do' });
    }

    // Das To-Do löschen
    await todo.destroy();

    // Erfolgreiche Antwort
    res.status(200).json({ message: 'To-Do erfolgreich gelöscht' });

    // Logger
    logger.info(`DELETE /todos/delete - UserID: ${userId} - To-Do mit ID ${todoId} erfolgreich gelöscht`);
  } catch (error) {
    // Fehlerbehandlung und Protokollierung
    logger.error(`DELETE /todos/delete - UserID: ${userId} - Fehler beim Löschen des To-Dos: ${error.message}`);
    console.error('Fehler beim Löschen des To-Dos:', error);
    res.status(500).json({ message: 'Fehler beim Löschen des To-Dos' });
  }
});


module.exports = { TodosRouter };
