const express = require('express');
const routes = express.Router();
const { LogoutRequest } = require('../../controllers/auth.controller');
const eventsRouter = require('./events.manager.router');
const { getUserRole } = require('../../controllers/users.controller');

routes.post('/logout', LogoutRequest);
routes.use('/events', eventsRouter);
routes.get('/role', getUserRole)

module.exports = routes;