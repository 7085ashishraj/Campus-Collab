const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to Database
const connectDB = require('./config/db');
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/', (req, res) => {
    res.send('CampusCollab API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
