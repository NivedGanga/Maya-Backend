const { refreshTokenService } = require('../services/token.service');
const refreshTokenRequest = async (req, res) => {
    const { refreshToken } = req.body;
    //check if refresh token is provided
    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    refreshTokenService(refreshToken, (error, data) => {
        if (error) {
            return res.status(403).json({ message: error });
        }
        res.status(200).json(data);
        return;
    });
}

module.exports = { refreshTokenRequest };