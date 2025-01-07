const { userRegisterSchema, userLoginSchema } = require('./validators');
const Joi = require('joi');

describe('Validators', () => {
    describe('userRegisterSchema', () => {
        it('should validate a correct user registration object', () => {
            const validUser = {
                fname: 'John',
                sname: 'Doe',
                email: 'john.doe@example.com',
                phone: '1234567890',
                branchLocationID: 1,
                dob: '2000-01-01',
                password: 'password123'
            };

            const { error } = userRegisterSchema.validate(validUser);
            expect(error).toBeUndefined();
        });

        it('should invalidate a user registration object with missing fields', () => {
            const invalidUser = {
                fname: 'John',
                email: 'john.doe@example.com',
                phone: '1234567890',
                branchLocationID: 1,
                dob: '2000-01-01',
                password: 'password123'
            };

            const { error } = userRegisterSchema.validate(invalidUser);
            expect(error).toBeDefined();
        });

        it('should invalidate a user registration object with invalid email', () => {
            const invalidUser = {
                fname: 'John',
                sname: 'Doe',
                email: 'john.doe',
                phone: '1234567890',
                branchLocationID: 1,
                dob: '2000-01-01',
                password: 'password123'
            };

            const { error } = userRegisterSchema.validate(invalidUser);
            expect(error).toBeDefined();
        });

        it('should invalidate a user registration object with underage user', () => {
            const invalidUser = {
                fname: 'John',
                sname: 'Doe',
                email: 'john.doe@example.com',
                phone: '1234567890',
                branchLocationID: 1,
                dob: '2010-01-01',
                password: 'password123'
            };

            const { error } = userRegisterSchema.validate(invalidUser);
            expect(error).toBeDefined();
        });

        it('should invalidate a user registration object with short password', () => {
            const invalidUser = {
                fname: 'John',
                sname: 'Doe',
                email: 'john.doe@example.com',
                phone: '1234567890',
                branchLocationID: 1,
                dob: '2000-01-01',
                password: '123'
            };

            const { error } = userRegisterSchema.validate(invalidUser);
            expect(error).toBeDefined();
        });
    });

    describe('userLoginSchema', () => {
        it('should validate a correct user login object', () => {
            const validLogin = {
                email: 'john.doe@example.com',
                password: 'password123'
            };

            const { error } = userLoginSchema.validate(validLogin);
            expect(error).toBeUndefined();
        });

        it('should invalidate a user login object with missing fields', () => {
            const invalidLogin = {
                email: 'john.doe@example.com'
            };

            const { error } = userLoginSchema.validate(invalidLogin);
            expect(error).toBeDefined();
        });

        it('should invalidate a user login object with invalid email', () => {
            const invalidLogin = {
                email: 'john.doe',
                password: 'password123'
            };

            const { error } = userLoginSchema.validate(invalidLogin);
            expect(error).toBeDefined();
        });
    });
});