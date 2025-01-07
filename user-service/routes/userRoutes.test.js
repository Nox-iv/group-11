const request = require('supertest');
const express = require('express');
const userRoutes = require('./userRoutes');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

jest.mock('../controllers/userController');
jest.mock('../middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {
    beforeEach(() => {
        process.env.API_KEY_USER_SERVICE = 'test-api-key';
        authMiddleware.mockImplementation((req, res, next) => next());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /register', () => {
        it('should register a new user', async () => {
            userController.register.mockImplementation((req, res) => res.status(201).json({ message: 'User registered' }));
            const res = await request(app)
                .post('/api/users/register')
                .set('x-api-key', 'test-api-key')
                .send({ username: 'test', password: 'password' });
            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual({ message: 'User registered' });
        });

        it('should return 403 if API key is invalid', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .set('x-api-key', 'invalid-key')
                .send({ username: 'test', password: 'password' });
            expect(res.statusCode).toBe(403);
            expect(res.body).toEqual({ error: 'Forbidden' });
        });
    });

    describe('POST /login', () => {
        it('should login a user', async () => {
            userController.login.mockImplementation((req, res) => res.status(200).json({ token: 'jwt-token' }));
            const res = await request(app)
                .post('/api/users/login')
                .set('x-api-key', 'test-api-key')
                .send({ username: 'test', password: 'password' });
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ token: 'jwt-token' });
        });
    });

    describe('GET /verify-email', () => {
        it('should verify user email', async () => {
            userController.verifyEmail.mockImplementation((req, res) => res.status(200).json({ verified: true }));
            const res = await request(app)
                .get('/api/users/verify-email')
                .set('x-api-key', 'test-api-key')
                .query({ token: 'email-token' });
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ verified: true });
        });
    });

    describe('Protected Routes', () => {
        it('should check if user exists', async () => {
            userController.checkUserExists.mockImplementation((req, res) => res.status(200).json({ exists: true }));
            const res = await request(app)
                .get('/api/users/check-user-exists')
                .set('x-api-key', 'test-api-key');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ exists: true });
        });

        // Add more tests for other protected routes similarly
    });
});