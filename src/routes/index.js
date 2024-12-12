const express = require('express');
const AuthRouter = require('./auth.router.js');
const apiRouter = require('./api.router.js');
const refreshTokenRouter = require('./tokens.router.js')

const routes = express.Router();

routes.use('/auth', AuthRouter);
routes.use('/tokens', refreshTokenRouter);
routes.use('/api', apiRouter);

module.exports = routes;
