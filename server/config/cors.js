const allowedOrigins = [
    'https://campus-collab-client.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    ...(process.env.CLIENT_URL || '').split(',')
].map(origin => origin.trim().replace(/\/+$/, '')).filter(Boolean);

module.exports = {
    origin: [...new Set(allowedOrigins)],
    credentials: true
};
