const express = require('express');
const cors = require('cors');
const path = require('path');
const sessionMiddleware = require('./middleware/session.middleware');
const adminMiddleware = require('./middleware/admin.middleware');
const dotenv = require('dotenv').config();
const authorizeUser = require('./middleware/tokens.middleware');
const { fetchAndSendBatch } = require('./services/imageproc.service');
const app = express();
const port = process.env.USER_SIDE_PORT || 5001;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors({
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);

// Import route
const routes = require('./routes');
console.log('User side server started 3e08q5yofjnwek');
app.use('/api', authorizeUser);
app.use('/admin', adminMiddleware);
app.use('/', routes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

fetchAndSendBatch();