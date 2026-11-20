const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const corsOptions = require('./config/cors');
const createReadiness = require('./middleware/readiness');

const createApp = ({ readiness = createReadiness(), logRequests = true } = {}) => {
    const app = express();
    app.use(helmet());
    app.use(cors(corsOptions));
    app.use(express.json());
    if (logRequests) app.use(morgan('dev'));
    app.use('/uploads', express.static('uploads'));

    app.get('/', (req, res) => res.send('CampusCollab API is running...'));
    app.get('/healthz', readiness.health);
    app.get('/api/health', readiness.health);

    // Reject requests immediately while MongoDB is unavailable instead of
    // buffering user queries or creating an account without a signing key.
    app.use('/api', readiness.requireDatabase);
    app.use('/api/auth', readiness.requireAuthConfig, require('./routes/authRoutes'));
    app.use('/api/projects', require('./routes/projectRoutes'));
    app.use('/api/upload', require('./routes/uploadRoutes'));
    app.use('/api/notifications', require('./routes/notificationRoutes'));
    app.use('/api/chat', require('./routes/chatRoutes'));
    app.use('/api/message', require('./routes/messageRoutes'));
    app.use('/api/articles', require('./routes/articleRoutes'));
    app.use('/api/questions', require('./routes/questionRoutes'));

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ message: 'Server Error', error: err.message });
    });

    return app;
};

module.exports = createApp;
