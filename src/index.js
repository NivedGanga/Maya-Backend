const express = require('express');
const cors = require('cors');
const sessionMiddleware = require('./middleware/session.middleware');
const dotenv = require('dotenv').config();
const authorizeUser = require('./middleware/tokens.middleware');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);

// Import route
const routes = require('./routes');

app.use('/api', authorizeUser);
app.use('/', routes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
