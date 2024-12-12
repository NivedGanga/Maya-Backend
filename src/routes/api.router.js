const express = require('express');
const routes = express.Router();
const { LogoutRequest } = require('../controllers/auth.controller')

routes.post('/logout', LogoutRequest);

module.exports = routes;