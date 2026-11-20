const mongoose = require('mongoose');

const createReadiness = ({
    isDatabaseConnected = () => mongoose.connection.readyState === 1,
    isAuthConfigured = () => Boolean(process.env.JWT_SECRET)
} = {}) => {
    const unavailable = (res) => res.status(503).set('Retry-After', '10').json({
        message: 'The service is temporarily unavailable. Please try again shortly.'
    });

    const health = (req, res) => {
        const databaseReady = isDatabaseConnected();
        const authenticationReady = isAuthConfigured();
        const ready = databaseReady && authenticationReady;
        res.set('Cache-Control', 'no-store').status(ready ? 200 : 503).json({
            status: ready ? 'ok' : 'unavailable',
            database: databaseReady ? 'connected' : 'disconnected',
            authentication: authenticationReady ? 'configured' : 'unconfigured'
        });
    };

    const requireDatabase = (req, res, next) => (
        isDatabaseConnected() ? next() : unavailable(res)
    );

    const requireAuthConfig = (req, res, next) => (
        isAuthConfigured() ? next() : unavailable(res)
    );

    return { health, requireDatabase, requireAuthConfig };
};

module.exports = createReadiness;
