const express = require('express');
const routes = express.Router();
const { LogoutRequest } = require('../../controllers/auth.controller');
const eventsRouter = require('./events.manager.router');

routes.post('/logout', LogoutRequest);
routes.use('/events', eventsRouter);

module.exports = routes;