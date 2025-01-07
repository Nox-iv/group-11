const request = require('supertest');
const express = require('express');
const userController = require('./userController');
const userService = require('../services/userService');
const { userRegisterSchema, userLoginSchema } = require('../utils/validators');

const app = express();
app.use(express.json());
app.post('/register', userController.register);
app.post('/login', userController.login);
app.get('/verifyEmail', userController.verifyEmail);
app.get('/checkUserExists', userController.checkUserExists);
app.get('/getUserEmail', userController.getUserEmail);
app.get('/getUserRole', userController.getUserRole);
app.get('/getUserDetails', userController.getUserDetails);
app.put('/userUpdateSelf', userController.userUpdateSelf);
app.put('/userUpdatePassword', userController.userUpdatePassword);
app.put('/adminUpdateUser', userController.adminUpdateUser);
app.get('/getAllUsers', userController.getAllUsers);
app.get('/getAllUsersPaginated', userController.getAllUsersPaginated);

jest.mock('../services/userService');
jest.mock('../utils/validators');

describe('User Controller', () => {
    describe('register', () => {
        it('should return 400 if validation fails', async () => {
            userRegisterSchema.validate.mockReturnValue({ error: { details: [{ message: 'Validation error' }] } });
            const res = await request(app).post('/register').send({});
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Validation error');
        });

        it('should return 200 if registration is successful', async () => {
            userRegisterSchema.validate.mockReturnValue({ error: null });
            userService.registerUser.mockResolvedValue({ userId: 1 });
            const res = await request(app).post('/register').send({ username: 'test', password: 'test' });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.userId).toBe(1);
        });
    });

    describe('login', () => {
        it('should return 400 if validation fails', async () => {
            userLoginSchema.validate.mockReturnValue({ error: { details: [{ message: 'Validation error' }] } });
            const res = await request(app).post('/login').send({});
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Validation error');
        });

        it('should return 200 if login is successful', async () => {
            userLoginSchema.validate.mockReturnValue({ error: null });
            userService.loginUser.mockResolvedValue({ token: 'token' });
            const res = await request(app).post('/login').send({ username: 'test', password: 'test' });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBe('token');
        });
    });

    describe('verifyEmail', () => {
        it('should return 200 if email verification is successful', async () => {
            userService.verifyEmail.mockResolvedValue({ verified: true });
            const res = await request(app).get('/verifyEmail').query({ verificationCode: 'code' });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.verified).toBe(true);
        });
    });

    describe('checkUserExists', () => {
        it('should return 200 if user exists', async () => {
            userService.checkUserExists.mockResolvedValue(true);
            const res = await request(app).get('/checkUserExists').query({ userId: 1 });
            expect(res.status).toBe(200);
            expect(res.body.exists).toBe(true);
        });
    });

    describe('getUserEmail', () => {
        it('should return 404 if user not found', async () => {
            userService.getUserEmailById.mockResolvedValue(null);
            const res = await request(app).get('/getUserEmail').query({ userId: 1 });
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('User not found');
        });

        it('should return 200 if user email is found', async () => {
            userService.getUserEmailById.mockResolvedValue('test@example.com');
            const res = await request(app).get('/getUserEmail').query({ userId: 1 });
            expect(res.status).toBe(200);
            expect(res.body.email).toBe('test@example.com');
        });
    });

    describe('getUserRole', () => {
        it('should return 404 if user not found', async () => {
            userService.getUserRole.mockResolvedValue(null);
            const res = await request(app).get('/getUserRole').query({ userId: 1 });
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('User not found');
        });

        it('should return 200 if user role is found', async () => {
            userService.getUserRole.mockResolvedValue('admin');
            const res = await request(app).get('/getUserRole').query({ userId: 1 });
            expect(res.status).toBe(200);
            expect(res.body.role).toBe('admin');
        });
    });

    describe('getUserDetails', () => {
        it('should return 200 if user details are found', async () => {
            userService.getUserDetails.mockResolvedValue({ username: 'test' });
            const res = await request(app).get('/getUserDetails').query({ userId: 1 });
            expect(res.status).toBe(200);
            expect(res.body.username).toBe('test');
        });
    });

    describe('userUpdateSelf', () => {
        it('should return 200 if user update is successful', async () => {
            userService.userUpdateSelf.mockResolvedValue({ updated: true });
            const res = await request(app).put('/userUpdateSelf').send({ userId: 1, fname: 'John', sname: 'Doe', phone: '1234567890' });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.updated).toBe(true);
        });
    });

    describe('userUpdatePassword', () => {
        it('should return 200 if password update is successful', async () => {
            userService.userUpdatePassword.mockResolvedValue({ updated: true });
            const res = await request(app).put('/userUpdatePassword').send({ userId: 1, oldPassword: 'old', newPassword: 'new' });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.updated).toBe(true);
        });
    });

    describe('adminUpdateUser', () => {
        it('should return 200 if admin update is successful', async () => {
            userService.adminUpdateUser.mockResolvedValue({ updated: true });
            const res = await request(app).put('/adminUpdateUser').send({ adminId: 1, targetUserId: 2, fname: 'John', sname: 'Doe', phone: '1234567890', branchLocationID: 1, dob: '2000-01-01', role: 'user', email: 'test@example.com' });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.updated).toBe(true);
        });
    });

    describe('getAllUsers', () => {
        it('should return 200 if users are found', async () => {
            userService.getAllUsers.mockResolvedValue([{ userId: 1, username: 'test' }]);
            const res = await request(app).get('/getAllUsers').query({ adminId: 1 });
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].username).toBe('test');
        });
    });

    describe('getAllUsersPaginated', () => {
        it('should return 200 if paginated users are found', async () => {
            userService.getAllUsersPaginated.mockResolvedValue([{ userId: 1, username: 'test' }]);
            const res = await request(app).get('/getAllUsersPaginated').query({ adminId: 1, limit: 10, offset: 0 });
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].username).toBe('test');
        });
    });
});