const { Router } = require('express');
const  ToDo  = require('../../database/models/todos/ToDo');
const TodosRouter = Router();

// GET /all - Gibt alle To-Dos zurück
TodosRouter.get('/all', async (req, res) => {
  try {
    // Alle ToDos aus der Datenbank abrufen
    const todos = await ToDo.findAll();
    
    // Antwort zurückgeben
    res.status(200).json(todos);
  } catch (error) {
    console.error('Fehler beim Abrufen der ToDos:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der ToDos' });
  }
});

module.exports = { TodosRouter };
