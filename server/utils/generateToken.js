const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
    // Generate Access Token
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15m'
    });

    // Generate Refresh Token
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d'
    });

    // Store Refresh Token in Cookie
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'lax', // Prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return accessToken;
};

module.exports = generateToken;
