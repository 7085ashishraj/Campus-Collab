import assert from 'node:assert/strict';
import { once } from 'node:events';
import http from 'node:http';
import test from 'node:test';
import api from '../src/api/axiosConfig.js';
import { signIn, signUp, getAuthErrorMessage } from '../src/api/auth.js';

const session = { _id: 'test-user', name: 'Auth Test', accessToken: 'test-token' };

const serve = async (t, handler) => {
  const storage = new Map();
  globalThis.localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key)
  };

  const server = http.createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    await handler(req, res, body ? JSON.parse(body) : null);
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const previousURL = api.defaults.baseURL;
  api.defaults.baseURL = `http://127.0.0.1:${server.address().port}/api`;
  t.after(() => {
    api.defaults.baseURL = previousURL;
    server.closeAllConnections();
    server.close();
    delete globalThis.localStorage;
  });
};

const sendSession = res => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(session));
};

test('login succeeds when backend startup exceeds the old 15-second timeout', async t => {
  let requests = 0;
  await serve(t, async (req, res, body) => {
    requests++;
    assert.equal(req.url, '/api/auth/login');
    assert.equal(body.email, 'student@example.com');
    assert.equal(body.password, ' password with spaces ');
    await new Promise(resolve => setTimeout(resolve, 16000));
    sendSession(res);
  });

  assert.deepEqual(await signIn(' student@example.com ', ' password with spaces '), session);
  assert.equal(requests, 1);
});

test('signup sends the complete profile and returns a valid session', async t => {
  const profile = {
    name: 'Auth Test', email: ' student@example.com ', password: 'test-password',
    university: 'Test University', skills: ['React']
  };
  await serve(t, (req, res, body) => {
    assert.equal(req.url, '/api/auth/register');
    assert.deepEqual(body, { ...profile, email: 'student@example.com' });
    res.statusCode = 201;
    sendSession(res);
  });

  assert.deepEqual(await signUp(profile), session);
});

test('invalid credentials preserve the API error message', async t => {
  await serve(t, (req, res) => {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid email or password' }));
  });

  await assert.rejects(signIn('student@example.com', 'wrong-password'), error => {
    assert.equal(getAuthErrorMessage(error), 'Invalid email or password');
    return true;
  });
});

test('a hosting loading page cannot become an authenticated session', async t => {
  await serve(t, (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<html><body>Starting service...</body></html>');
  });

  await assert.rejects(signIn('student@example.com', 'test-password'), {
    code: 'ERR_INVALID_AUTH_RESPONSE'
  });
  assert.equal(localStorage.getItem('user'), null);
});

test('a lost signup response is not automatically retried', async t => {
  let registrations = 0;
  await serve(t, (req, res) => {
    registrations++;
    res.destroy();
  });

  await assert.rejects(signUp({ email: 'student@example.com', password: 'test-password' }), error => {
    assert.match(getAuthErrorMessage(error, 'register'), /try signing in before registering again/i);
    return true;
  });
  assert.equal(registrations, 1);
});

test('corrupted stored session data does not block a fresh login', async t => {
  await serve(t, (req, res) => sendSession(res));
  localStorage.setItem('user', '{invalid-json');

  assert.deepEqual(await signIn('student@example.com', 'test-password'), session);
  assert.equal(localStorage.getItem('user'), null);
});

test('Vercel-hosted clients send authentication through their own API origin', async t => {
  globalThis.window = { location: { hostname: 'campus-collab-client.vercel.app' } };
  t.after(() => { delete globalThis.window; });
  const { default: deployedApi } = await import('../src/api/axiosConfig.js?vercel-test');
  assert.equal(deployedApi.defaults.baseURL, '/api');
});
