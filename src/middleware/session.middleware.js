const session = require('express-session');
const dotenv = require('dotenv').config();

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET, // Secret key for signing the session
    resave: false,                  // Do not save the session if it wasn't modified
    saveUninitialized: false,       // Don't save uninitialized sessions
    cookie: {
        secure: false,                // Set to true for HTTPS connections
        maxAge: 5 * 60 * 1000,       // Session expires after 30 minutes
    }
});

module.exports = sessionMiddleware;