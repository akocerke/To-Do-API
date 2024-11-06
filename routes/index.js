// routes/index.js
const express = require('express');
const { UsersRouter } = require('./users');
const { AuthRouter } = require('./auth');
const { TodosRouter } = require('./todos');
const userMiddleware = require('../middleware/userMiddleware');

const AppRouter = express.Router();

AppRouter.use('/users', userMiddleware, UsersRouter);
AppRouter.use('/auth', AuthRouter);
AppRouter.use('/todos', userMiddleware, TodosRouter);

module.exports = { AppRouter };
