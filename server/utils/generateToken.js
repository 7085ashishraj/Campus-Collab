const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
    // Generate Access Token
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    // Authentication uses the access token. Refresh cookies are optional;
    // deployments configured with JWT_SECRET alone must still be able to log in.
    if (process.env.JWT_REFRESH_SECRET) {
        const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '7d'
        });

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
    }

    return accessToken;
};

module.exports = generateToken;
