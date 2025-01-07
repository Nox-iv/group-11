const request = require('supertest');
const express = require('express');
const authController = require('./authController');
const authService = require('../services/authService');
const tokenUtils = require('../utils/token');

const app = express();
app.use(express.json());
app.post('/register', authController.registerCredentials);
app.post('/check-password', authController.checkPassword);
app.post('/update-password', authController.updateUserPassword);

jest.mock('../services/authService');
jest.mock('../utils/token');

describe('Auth Controller', () => {
    describe('registerCredentials', () => {
        it('should return 400 if userId or password is missing', async () => {
            const res = await request(app).post('/register').send({});
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Missing userId or password');
        });

        it('should return result on successful registration', async () => {
            authService.register.mockResolvedValue({ success: true });
            const res = await request(app).post('/register').send({ userId: 'user1', password: 'pass1' });
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ success: true });
        });
    });

    describe('checkPassword', () => {
        it('should return 400 if userId or password is missing', async () => {
            const res = await request(app).post('/check-password').send({});
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Missing userId or password');
        });

        it('should return 401 if credentials are invalid', async () => {
            authService.checkPassword.mockResolvedValue({ valid: false });
            const res = await request(app).post('/check-password').send({ userId: 'user1', password: 'wrongpass' });
            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Invalid credentials');
        });

        it('should return token if credentials are valid', async () => {
            authService.checkPassword.mockResolvedValue({ valid: true });
            authService.getUserRole.mockResolvedValue('user');
            tokenUtils.generateToken.mockReturnValue('token123');
            const res = await request(app).post('/check-password').send({ userId: 'user1', password: 'pass1' });
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ valid: true, token: 'token123' });
        });
    });

    describe('updateUserPassword', () => {
        it('should return 400 if required fields are missing', async () => {
            const res = await request(app).post('/update-password').send({});
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Missing required fields');
        });

        it('should return result on successful password update', async () => {
            authService.updateUserPassword.mockResolvedValue({ success: true });
            const res = await request(app).post('/update-password').send({ userId: 'user1', oldPassword: 'oldpass', newPassword: 'newpass' });
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ success: true });
        });
    });
});