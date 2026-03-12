import request from 'supertest';
import app from '../server.js';

describe('Health endpoint', () => {
    it('returns OK status', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('status', 'OK');
        expect(res.body).toHaveProperty('timestamp');
    });
});



