const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const { once } = require('node:events');
const http = require('node:http');
const test = require('node:test');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const createApp = require('../app');
const User = require('../models/User');

const uri = process.env.TEST_MONGO_URI;

test('real MongoDB signup, password hashing, login, protected request, duplicate signup and logout',
  { skip: !uri }, async t => {
    const database = new URL(uri);
    assert.ok(['localhost', '127.0.0.1'].includes(database.hostname), 'Use an isolated local test database.');
    assert.match(database.pathname, /^\/campuscollab_codex_auth_test_[a-zA-Z0-9_]+$/);
    process.env.JWT_SECRET = randomBytes(32).toString('hex');
    delete process.env.JWT_REFRESH_SECRET;

    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    let mayRemoveDatabase = false;
    t.after(async () => {
      if (mayRemoveDatabase) {
        assert.equal(mongoose.connection.db.databaseName, database.pathname.slice(1));
        await mongoose.connection.dropDatabase();
      }
      await mongoose.disconnect();
    });
    const existingCollections = await mongoose.connection.db.listCollections().toArray();
    for (const collection of existingCollections) {
      assert.equal(await mongoose.connection.db.collection(collection.name).estimatedDocumentCount(), 0,
        'Test database must not contain existing data.');
    }
    mayRemoveDatabase = true;

    const server = http.createServer(createApp({ logRequests: false }));
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    t.after(() => { server.closeAllConnections(); server.close(); });
    const base = `http://127.0.0.1:${server.address().port}/api`;
    const post = (path, body) => fetch(base + path, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    const profile = {
      name: 'CampusCollab Auth Test', email: 'auth-flow@example.invalid',
      password: randomBytes(20).toString('base64url'), university: 'Test University', skills: ['React']
    };

    const registration = await post('/auth/register', profile);
    assert.equal(registration.status, 201);
    const registered = await registration.json();
    assert.equal(jwt.verify(registered.accessToken, process.env.JWT_SECRET).userId, registered._id);
    assert.equal(registered.password, undefined);
    const stored = await User.findById(registered._id);
    assert.notEqual(stored.password, profile.password);
    assert.equal(await stored.matchPassword(profile.password), true);

    const login = await post('/auth/login', { email: profile.email, password: profile.password });
    assert.equal(login.status, 200);
    const session = await login.json();
    assert.equal(session._id, registered._id);
    const protectedResponse = await fetch(base + '/chat', {
      headers: { Authorization: `Bearer ${session.accessToken}` }
    });
    assert.equal(protectedResponse.status, 200);
    assert.deepEqual(await protectedResponse.json(), []);
    assert.equal((await post('/auth/login', { email: profile.email, password: 'wrong-password' })).status, 401);
    assert.equal((await post('/auth/register', profile)).status, 400);
    assert.equal((await post('/auth/logout', {})).status, 200);
    assert.equal((await fetch(base + '/health')).status, 200);
  });
