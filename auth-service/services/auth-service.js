const db = require('../utils/db');
const bcrypt = require('bcrypt');

module.exports = {

    async register({ userID, password }) {
        const existingUser = await db.query('SELECT user_id FROM user_credentials WHERE user_id = $1', [userID]);

        if (existingUser.rowCount > 0) {
            const err = new Error('User already registered');
            err.status = 409;
            throw err;
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        const connection = await db.getConnection();
        try {
            await connection.query('BEGIN');
            await connection.query('INSERT INTO user_credentials (user_id, password_hash) VALUES ($1, $2)', [userID, passwordHash]);
            await connection.query('COMMIT');
        } catch (error) {
            console.error(error);
            await connection.query('ROLLBACK');
            const err = new Error('Failed to register user');
            err.status = 500;
            throw err;
        } finally {
            connection.release();
        }

        return { status: 201, message: 'User registered successfully' };
    },

    async checkPassword({ userID, password }) {
        const user = await db.query('SELECT password_hash FROM user_credentials WHERE user_id = $1', [userID]);

        if (user.rowCount === 0) {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }

        const passwordHash = user.rows[0].password_hash;
        const match = await bcrypt.compare(password, passwordHash);

        if (!match) {
            const err = new Error('Incorrect password');
            err.status = 401;
            throw err;
        }

        return { status: 200, message: 'Password correct' };
    },

    async changePassword({ userID, newPassword }) {
        const user = await db.query('SELECT user_id FROM user_credentials WHERE user_id = $1', [userID]);

        if (user.rowCount === 0) {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        const connection = await db.getConnection();
        try {
            await connection.query('BEGIN');
            await connection.query('UPDATE user_credentials SET password_hash = $1 WHERE user_id = $2', [newPasswordHash, userID]);
            await connection.query('COMMIT');
        } catch (error) {
            console.error(error);
            await connection.query('ROLLBACK');
            const err = new Error('Failed to change password');
            err.status = 500;
            throw err;
        } finally {
            connection.release();
        }

        return { status: 200, message: 'Password changed successfully' };
    },

    async deleteAccount({ userID }) {
        const connection = await db.getConnection();
        try {
            await connection.query('BEGIN');
            await connection.query('DELETE FROM user_credentials WHERE user_id = $1', [userID]);
            await connection.query('COMMIT');
        } catch (error) {
            console.error(error);
            await connection.query('ROLLBACK');
            const err = new Error('Failed to delete account');
            err.status = 500;
            throw err;
        } finally {
            connection.release();
        }

        return { status: 200, message: 'Account deleted successfully' };
    }

};
