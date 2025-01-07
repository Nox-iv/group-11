const request = require('supertest');
const express = require('express');
const authRoutes = require('./authRoutes');
const authController = require('../controllers/authController');

jest.mock('../controllers/authController');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
    const validApiKey = 'valid-api-key';
    beforeAll(() => {
        process.env.AUTH_SERVICE_API_KEY = validApiKey;
    });

    describe('API Key Middleware', () => {
        it('should return 403 if API key is missing', async () => {
            const res = await request(app).post('/auth/register');
            expect(res.status).toBe(403);
            expect(res.body).toEqual({ error: 'Forbidden' });
        });

        it('should return 403 if API key is invalid', async () => {
            const res = await request(app)
                .post('/auth/register')
                .set('x-api-key', 'invalid-api-key');
            expect(res.status).toBe(403);
            expect(res.body).toEqual({ error: 'Forbidden' });
        });

        it('should call next if API key is valid', async () => {
            authController.registerCredentials.mockImplementation((req, res) => res.status(200).send());
            const res = await request(app)
                .post('/auth/register')
                .set('x-api-key', validApiKey);
            expect(res.status).toBe(200);
        });
    });

    describe('POST /register', () => {
        it('should call registerCredentials controller', async () => {
            authController.registerCredentials.mockImplementation((req, res) => res.status(200).send());
            const res = await request(app)
                .post('/auth/register')
                .set('x-api-key', validApiKey)
                .send({ username: 'test', password: 'password' });
            expect(res.status).toBe(200);
            expect(authController.registerCredentials).toHaveBeenCalled();
        });
    });

    describe('POST /check-password', () => {
        it('should call checkPassword controller', async () => {
            authController.checkPassword.mockImplementation((req, res) => res.status(200).send());
            const res = await request(app)
                .post('/auth/check-password')
                .set('x-api-key', validApiKey)
                .send({ username: 'test', password: 'password' });
            expect(res.status).toBe(200);
            expect(authController.checkPassword).toHaveBeenCalled();
        });
    });

    describe('PATCH /update-user-password', () => {
        it('should call updateUserPassword controller', async () => {
            authController.updateUserPassword.mockImplementation((req, res) => res.status(200).send());
            const res = await request(app)
                .patch('/auth/update-user-password')
                .set('x-api-key', validApiKey)
                .send({ username: 'test', newPassword: 'newpassword' });
            expect(res.status).toBe(200);
            expect(authController.updateUserPassword).toHaveBeenCalled();
        });
    });
});