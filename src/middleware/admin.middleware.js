const adminMiddleware = async (req, res, next) => {
    // authorize user
    const jwt = require('jsonwebtoken');
    const dotenv = require('dotenv').config();
    const { Tokens, Roles } = require('../models');
    // Get the access token from the request
    const at = req.headers['authorization'];
    if (!at) {
        return res.status(401).json({ message: 'Access token is required - middleware' });
    }
    //slice the bearer
    const accessToken = at.slice(7);
    accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    // Verify the access token
    jwt.verify(accessToken, accessTokenSecret, async (error, user) => {
        if (error) {
            return res.status(403).json({ message: 'Invalid access token-1' });
        }
        // Check if the access token exists in the database
        const token = await Tokens.findOne({ where: { access_token: accessToken } })
        if (!token) {
            return res.status(403).json({ message: 'Invalid access token-2' });
        }
        // Check if the user is an admin
        const role = await Roles.findOne({ where: { userid: user.userId } });
        if (role.dataValues.Role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
        return;
    });
}

module.exports = adminMiddleware;