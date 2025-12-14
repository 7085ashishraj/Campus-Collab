const fs = require('fs');
const path = require('path');

const envContent = `NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/campuscollab
JWT_SECRET=campuscollab_secret_key_123
JWT_REFRESH_SECRET=campuscollab_refresh_secret_key_456
`;

fs.writeFileSync(path.join(__dirname, '.env'), envContent, { encoding: 'utf8' });
console.log('.env created successfully');
