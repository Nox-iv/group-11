const authService = require('./authService');
const pool = require('../db/pool');
const bcrypt = require('bcrypt');

jest.mock('../db/pool');
jest.mock('bcrypt');

const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
};

beforeEach(() => {
    pool.connect.mockResolvedValue(mockClient);
    mockClient.query.mockReset();
    bcrypt.hash.mockReset();
    bcrypt.compare.mockReset();
});

describe('authService', () => {

    describe('checkPassword', () => {
        it('should validate correct password', async () => {
            pool.query.mockResolvedValue({
                rowCount: 1,
                rows: [{ password_hash: 'hashedPassword' }],
            });
            bcrypt.compare.mockResolvedValue(true);

            const result = await authService.checkPassword('user1', 'password123');
            expect(result).toEqual({ valid: true });
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['user1']);
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
        });

        it('should invalidate incorrect password', async () => {
            pool.query.mockResolvedValue({
                rowCount: 1,
                rows: [{ password_hash: 'hashedPassword' }],
            });
            bcrypt.compare.mockResolvedValue(false);

            const result = await authService.checkPassword('user1', 'wrongPassword');
            expect(result).toEqual({ valid: false });
        });

        it('should invalidate non-existing user', async () => {
            pool.query.mockResolvedValue({ rowCount: 0 });

            const result = await authService.checkPassword('user2', 'password123');
            expect(result).toEqual({ valid: false });
        });
    });

    describe('getUserRole', () => {
        it('should return user role if user exists', async () => {
            pool.query.mockResolvedValue({
                rowCount: 1,
                rows: [{ user_role: 'admin' }],
            });

            const role = await authService.getUserRole('user1');
            expect(role).toBe('admin');
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['user1']);
        });

        it('should return null if user does not exist', async () => {
            pool.query.mockResolvedValue({ rowCount: 0 });

            const role = await authService.getUserRole('user2');
            expect(role).toBeNull();
        });
    });
});