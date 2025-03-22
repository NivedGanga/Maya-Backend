const express = require('express');
const routes = express.Router();
const usersRouter = require('./users.router');
const eventsRouter = require('./events.router');

routes.use('/users', usersRouter);
routes.use('/events', eventsRouter);

module.exports = routes;