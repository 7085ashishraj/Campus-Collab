const assert = require('node:assert/strict');
const test = require('node:test');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');

const configure = (t, refreshSecret) => {
  const previous = {};
  for (const key of ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'NODE_ENV']) previous[key] = process.env[key];
  process.env.JWT_SECRET = 'test-only-access-secret';
  process.env.NODE_ENV = 'production';
  if (refreshSecret) process.env.JWT_REFRESH_SECRET = refreshSecret;
  else delete process.env.JWT_REFRESH_SECRET;
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
};

test('login can issue a valid session with the original JWT_SECRET-only configuration', t => {
  configure(t);
  const response = { cookie: () => assert.fail('Refresh cookie should not be required.') };
  const token = generateToken(response, 'test-user');
  assert.equal(jwt.verify(token, process.env.JWT_SECRET).userId, 'test-user');
});

test('configured refresh cookies keep their separate signing key and production attributes', t => {
  configure(t, 'test-only-refresh-secret');
  let cookie;
  const token = generateToken({ cookie: (...args) => { cookie = args; } }, 'test-user');
  assert.equal(jwt.verify(token, process.env.JWT_SECRET).userId, 'test-user');
  assert.equal(cookie[0], 'jwt');
  assert.equal(jwt.verify(cookie[1], process.env.JWT_REFRESH_SECRET).userId, 'test-user');
  assert.throws(() => jwt.verify(cookie[1], process.env.JWT_SECRET));
  assert.equal(cookie[2].httpOnly, true);
  assert.equal(cookie[2].secure, true);
  assert.equal(cookie[2].sameSite, 'lax');
});

test('an access-token signing secret remains mandatory', t => {
  configure(t);
  delete process.env.JWT_SECRET;
  assert.throws(() => generateToken({ cookie: () => assert.fail('No cookie should be issued.') }, 'test-user'));
});
