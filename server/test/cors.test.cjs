const assert = require('node:assert/strict');
const http = require('node:http');
const { once } = require('node:events');
const test = require('node:test');
const express = require('express');
const cors = require('cors');
const corsOptions = require('../config/cors');

const app = express();
app.use(cors(corsOptions));
app.post('/api/auth/login', (req, res) => res.sendStatus(200));

const send = async (t, method, headers) => {
  const server = http.createServer(app);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1', port: server.address().port,
      path: '/api/auth/login', method, headers
    }, res => {
      res.resume();
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers }));
    });
    req.on('error', reject);
    req.end();
  });
};

test('the deployed Vercel frontend can send credentialed auth requests', async t => {
  const response = await send(t, 'OPTIONS', {
    Origin: 'https://campus-collab-client.vercel.app',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'content-type'
  });

  assert.equal(response.status, 204);
  assert.equal(response.headers['access-control-allow-origin'], 'https://campus-collab-client.vercel.app');
  assert.equal(response.headers['access-control-allow-credentials'], 'true');
  assert.match(response.headers['access-control-allow-methods'], /POST/);
  assert.match(response.headers['access-control-allow-headers'], /content-type/);
});

test('unrelated origins do not receive an allow-origin header', async t => {
  const response = await send(t, 'OPTIONS', {
    Origin: 'https://unrelated.example',
    'Access-Control-Request-Method': 'POST'
  });

  assert.equal(response.headers['access-control-allow-origin'], undefined);
});

test('localhost development remains allowed', async t => {
  const response = await send(t, 'POST', { Origin: 'http://localhost:5173' });

  assert.equal(response.status, 200);
  assert.equal(response.headers['access-control-allow-origin'], 'http://localhost:5173');
});
