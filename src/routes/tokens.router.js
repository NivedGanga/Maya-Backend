const express = require('express');
const routes = express.Router();
const { refreshTokenRequest } = require('../controllers/tokens.controller');

routes.post('/refresh', refreshTokenRequest);

module.exports = routes;