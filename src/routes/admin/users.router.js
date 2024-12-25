const { getUsersRequest, acceptUserRequest, rejectUserRequest } = require('../../controllers/users.controller');
const express = require('express');
const routes = express.Router();

routes.get('/', getUsersRequest);
routes.post('/accept', acceptUserRequest);
routes.post('/reject', rejectUserRequest);

module.exports = routes;