const refreshTokenService = async (refreshToken, callback) => {
    const jwt = require('jsonwebtoken');
    const { Tokens } = require('../models');
    const dotenv = require('dotenv').config();
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    // Verify the refresh token
    jwt.verify(refreshToken, refreshTokenSecret, async (error, user) => {
        if (error) {
            return callback('Invalid refresh token', null);
        }
        // Check if the refresh token exists in the database
        const token = await Tokens.findOne({ where: { refresh_token: refreshToken } })
        console.log(token);
        if (!token) {
            return callback('Invalid refresh token', null);
        }

        // Generate a new access token
        const accessToken = jwt.sign(
            { userId: user.userId, email: user.email },
            accessTokenSecret,
            { expiresIn: '1h' } // Access token valid for 1 hour
        );
        //update the access token in the database
        Tokens.update({ access_token: accessToken }, { where: { refresh_token: refreshToken } });
        callback(null, { accessToken });
    });
}


module.exports = { refreshTokenService };