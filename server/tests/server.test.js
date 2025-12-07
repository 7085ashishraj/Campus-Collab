const request = require('supertest');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('CampusCollab API is running...');
});

describe('GET /', () => {
    it('responds with startup message', async () => {
        const response = await request(app).get('/');
        expect(response.text).toBe('CampusCollab API is running...');
        expect(response.statusCode).toBe(200);
    });
});
