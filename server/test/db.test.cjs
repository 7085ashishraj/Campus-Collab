const assert = require('node:assert/strict');
const test = require('node:test');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { connectDBWithRetry } = connectDB;

test('production refuses an absent database URI instead of connecting to localhost', async t => {
  const previousURI = process.env.MONGO_URI;
  const previousMode = process.env.NODE_ENV;
  delete process.env.MONGO_URI;
  process.env.NODE_ENV = 'production';
  t.after(() => {
    if (previousURI === undefined) delete process.env.MONGO_URI;
    else process.env.MONGO_URI = previousURI;
    if (previousMode === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousMode;
  });
  const connect = t.mock.method(mongoose, 'connect', () => assert.fail('No local production fallback.'));
  await assert.rejects(connectDB(), { code: 'DATABASE_NOT_CONFIGURED' });
  assert.equal(connect.mock.callCount(), 0);
});

test('an initial DNS failure retries and recovers without terminating the server', async () => {
  let attempts = 0;
  const errors = [];
  const result = { connection: { host: 'test-database' } };
  const connection = await connectDBWithRetry({
    retryDelayMs: 1,
    logger: { error: message => errors.push(message), log: () => {} },
    connect: async () => {
      attempts++;
      if (attempts === 1) {
        const error = new Error('mongodb+srv://user:private-test-value@invalid.example');
        error.code = 'ENOTFOUND';
        throw error;
      }
      return result;
    }
  });
  assert.equal(connection, result);
  assert.equal(attempts, 2);
  assert.match(errors[0], /ENOTFOUND/);
  assert.doesNotMatch(errors[0], /private-test-value/);
});
