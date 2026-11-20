const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGO_URI && process.env.NODE_ENV === 'production') {
        const error = new Error('MONGO_URI must be configured in production.');
        error.code = 'DATABASE_NOT_CONFIGURED';
        throw error;
    }

    return mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campuscollab', {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000
    });
};

const connectDBWithRetry = async ({
    connect = connectDB,
    retryDelayMs = 10000,
    logger = console
} = {}) => {
    for (;;) {
        try {
            const conn = await connect();
            logger.log(`MongoDB Connected: ${conn.connection.host}`);
            return conn;
        } catch (error) {
            // Do not log connection strings: they can contain credentials.
            logger.error(`Database connection failed (${error.code || error.name}). Check MONGO_URI and cluster availability. Retrying in ${retryDelayMs / 1000}s.`);
            await new Promise(resolve => setTimeout(resolve, retryDelayMs));
        }
    }
};

module.exports = connectDB;
module.exports.connectDBWithRetry = connectDBWithRetry;
