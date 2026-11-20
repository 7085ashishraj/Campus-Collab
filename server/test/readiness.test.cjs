const assert = require('node:assert/strict');
const http = require('node:http');
const { once } = require('node:events');
const test = require('node:test');
const createApp = require('../app');
const createReadiness = require('../middleware/readiness');
const User = require('../models/User');

const serve = async (t, { database = () => true, authentication = () => true } = {}) => {
  const app = createApp({
    readiness: createReadiness({ isDatabaseConnected: database, isAuthConfigured: authentication }),
    logRequests: false
  });
  const server = http.createServer(app);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => { server.closeAllConnections(); server.close(); });
  return (path, options = {}) => fetch(`http://127.0.0.1:${server.address().port}${path}`, options);
};

test('database outage rejects registration without reading or writing users', async t => {
  const find = t.mock.method(User, 'findOne', async () => assert.fail('Database should not be queried.'));
  const create = t.mock.method(User, 'create', async () => assert.fail('No account should be written.'));
  const send = await serve(t, { database: () => false });
  const response = await send('/api/auth/register', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email: 'auth@example.invalid', password: 'test-password', university: 'Test' })
  });
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('retry-after'), '10');
  assert.equal(find.mock.callCount(), 0);
  assert.equal(create.mock.callCount(), 0);
});

test('health reports failed readiness without disclosing credentials', async t => {
  const send = await serve(t, { database: () => false });
  const response = await send('/api/health');
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), {
    status: 'unavailable', database: 'disconnected', authentication: 'configured'
  });
});

test('health becomes ready when the database connection recovers', async t => {
  let connected = false;
  const send = await serve(t, { database: () => connected });
  assert.equal((await send('/api/health')).status, 503);
  connected = true;
  const response = await send('/healthz');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, 'ok');
});

test('missing authentication configuration cannot create a partially registered user', async t => {
  const create = t.mock.method(User, 'create', async () => assert.fail('No account should be written.'));
  const send = await serve(t, { authentication: () => false });
  const response = await send('/api/auth/register', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}'
  });
  assert.equal(response.status, 503);
  assert.equal(create.mock.callCount(), 0);
});

test('healthy authentication still returns the normal invalid-credentials response', async t => {
  t.mock.method(User, 'findOne', async () => null);
  const send = await serve(t);
  const response = await send('/api/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'auth@example.invalid', password: 'wrong-password' })
  });
  assert.equal(response.status, 401);
  assert.equal((await response.json()).message, 'Invalid email or password');
});
