const express = require('express');
const routes = express.Router();
const usersRouter = require('./users.router');
const eventsRouter = require('./events.router');
const { getFileStoreDetails } = require('../../controllers/file.controller');

routes.use('/users', usersRouter);
routes.use('/events', eventsRouter);
routes.get('/files', getFileStoreDetails)
module.exports = routes;