const session = require('express-session');
const dotenv = require('dotenv').config();
const MemoryStore = require('memorystore')(session);
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
        checkPeriod: 86400000, // Prune expired entries every 24 hours (in ms)
    }),
    cookie: {
        secure: false,
        httpOnly: false,
        sameSite: false,
        maxAge: 5 * 60 * 1000, // 5 minutes expiry (matches your original)
    }
});

module.exports = sessionMiddleware;