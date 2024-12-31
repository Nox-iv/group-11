const db = require('../utils/db');
const { generateVerificationCode, sendVerificationEmail } = require('./email-service.js');
const { checkAgeOver18 } = require('../utils/age-validator');
const axios = require('axios');

module.exports = {

    async register({ fname, sname, email, phone, branchLocationID, dob, password }) {
        let user_id = null;
        
        if (!checkAgeOver18(dob)) {
            throw {status: 400, message: 'User must be over 18 years old'};
        }

        // Check if email is already registered
        const existingUser = await db.query('SELECT user_id FROM users WHERE email = $1', [email]);
        if (existingUser.rowCount > 0) {
            throw {status: 409, message: 'Email already registered'};
        }

        // atomicly handle inserting the users details into the user table, and using the auth service to store their credentials (email and password). if one fails, the other will be rolled back
        let connection = await db.getConnection();
        try {
            await connection.query('BEGIN');
            const result = await connection.query('INSERT INTO users (first_name, last_name, email, phone, branch_location_id, date_of_birth) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id', [fname, sname, email, phone, branchLocationID, dob]);
            const userID = result.rows[0].user_id;
            const response = await axios.post(`${process.env.AUTH_SERVICE_URL}/register`, { userID, password }, { headers: { 'Token': process.env.AUTH_SERVICE_TOKEN, 'Authorization':  'Bearer ' + process.env.API_TOKEN } });
            if (response.status !== 201) {
                throw {status: 500, message: 'Failed to register user'};
            }
            await connection.query('COMMIT');
            user_id = userID;
        } catch (error) {
            await connection.query('ROLLBACK');
            console.log(error);
            throw {status: 500, message: 'Failed to register user'};
        } finally {
            connection.release();
        }

        const verificationCode = generateVerificationCode(user_id);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        connection = await db.getConnection();
        try {
            await connection.query('BEGIN');
            await connection.query('INSERT INTO verification_codes (verification_code, user_id, expires_at) VALUES ($1, $2, $3)', [verificationCode, user_id, expiresAt]);
            await connection.query('COMMIT');
        } catch (error) {
            await connection.query('ROLLBACK');
            throw {status: 500, message: 'Failed to store verification code'};
        } finally {
            connection.release();
        }

        await sendVerificationEmail(email, verificationCode);

        return {status: 201, message: 'User registered successfully'};

    },

    async verifyEmail(verificationCode) {
        const result = await db.query('SELECT user_id FROM verification_codes WHERE verification_code = $1 AND expires_at > NOW()', [verificationCode]);

        if (result.rowCount === 0) {
            throw {status: 400, message: 'Invalid verification code'};
        }

        const userId = result.rows[0].user_id;

        await db.query('UPDATE users SET is_verified = true WHERE user_id = $1', [userId]);
        await db.query('DELETE FROM verification_codes WHERE user_id = $1', [userId]);

        return {status: 200, message: 'Email verified successfully'};  
    },

    async login(email, password) {
        let result;
        try {
            result = await db.query('SELECT user_id, is_verified FROM users WHERE email = $1', [email]);
        } catch (error) {
            throw {status: 500, message: 'Failed to login'};
        }

        if (result.rowCount === 0) {
            throw {status: 401, message: 'Invalid email or password'};
        }

        const userID = result.rows[0].user_id;
        const isVerified = result.rows[0].is_verified;

        let authResponse;
        try {
            authResponse = await axios.post(`${process.env.AUTH_SERVICE_URL}/check-password`, { userID, password }, { headers: { 'Token': process.env.AUTH_SERVICE_TOKEN, 'Authorization':  'Bearer ' + process.env.API_TOKEN } });
        } catch (error) {
            console.log(error);
            if (error.response.data.message === "Incorrect password") {
                throw {status: 401, message: 'Invalid email or password'};
            }
            throw {status: 500, message: 'Failed to login'};
        }

        if (authResponse.status !== 200) {
            throw {status: 401, message: 'Invalid email or password'};
        }

        if (isVerified) {

            const userDetails = await db.query('SELECT user_id, branch_location_id, user_role FROM users WHERE user_id = $1', [userID]);
            return {status: 200, user: userDetails.rows[0]};
        }

        let existingVerificationCode
        try { 
            existingVerificationCode = await db.query('SELECT verification_code FROM verification_codes WHERE user_id = $1 AND expires_at > NOW()', [userID]);
        } catch (error) {
            console.log(error);
            throw {status: 500, message: 'Failed to login'};
        }

        if (existingVerificationCode.rowCount > 0) {
            throw {status: 403, message: 'Email not verified'};
        }

        const verificationCode = generateVerificationCode(userID);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        let connection = await db.getConnection();
        try {
            await connection.query('BEGIN');
            await connection.query('INSERT INTO verification_codes (verification_code, user_id, expires_at) VALUES ($1, $2, $3)', [verificationCode, userID, expiresAt]);
            await connection.query('COMMIT');
        } catch (error) {
            await connection.query('ROLLBACK');
            throw {status: 500, message: 'Failed to store verification code'};
        } finally {
            connection.release();
        }

        await sendVerificationEmail(email, verificationCode);

        throw {status: 403, message: 'Email not verified. A new verification code has been sent to your email'};

    },

    async getUserRole(userID) {
        const result = await db.query('SELECT role FROM users WHERE user_id = $1', [userID]);

        if (result.rowCount === 0) {
            throw {status: 404, message: 'User not found'};
        }

        return result.rows[0].role;
    },

    async getUserEmail(userID) {
        const result = await db.query('SELECT email FROM users WHERE user_id = $1', [userID]);

        if (result.rowCount === 0) {
            throw {status: 404, message: 'User not found'};
        }

        return result.rows[0].email;
    },

    async checkUserIdExists(userID) {
        const result = await db.query('SELECT user_id FROM users WHERE user_id = $1', [userID]);

        if (result.rowCount === 0) {
            throw {status: 404, message: 'User not found'};
        }
    },

    async userUpdateUser({ userID, fname, sname, phone }) {
        await this.checkUserIdExists(userID);

        connection = await db.getConnection();
        try {
            await connection.query('BEGIN');
            if (fname) {
                await connection.query('UPDATE users SET first_name = $1 WHERE user_id = $2', [fname, userID]);
            }
            if (sname) {
                await connection.query('UPDATE users SET last_name = $1 WHERE user_id = $2', [sname, userID]);
            }
            if (phone) {
                await connection.query('UPDATE users SET phone = $1 WHERE user_id = $2', [phone, userID]);
            }
            await connection.query('COMMIT');
        } catch (error) {
            await connection.query('ROLLBACK');
            throw {status: 500, message: 'Failed to update user'};
        } finally {
            connection.release();
        }

    },

    async adminUpdateUser({ currentUserID, targetUserID, fname, sname, phone, branchLocationID, dob, role, email }) {
        // check if the current user is an admin
        const currentUserRole = await this.getUserRole(currentUserID);
        if (currentUserRole !== 'admin') {
            throw {status: 403, message: 'Forbidden'};
        }

        // check if the target user exists
        await this.checkUserIdExists(targetUserID);

        connection = await db.getConnection();
        try {
            await connection.query('BEGIN');
            if (fname) {
                await connection.query('UPDATE users SET first_name = $1 WHERE user_id = $2', [fname, targetUserID]);
            }
            if (sname) {
                await connection.query('UPDATE users SET last_name = $1 WHERE user_id = $2', [sname, targetUserID]);
            }
            if (phone) {
                await connection.query('UPDATE users SET phone = $1 WHERE user_id = $2', [phone, targetUserID]);
            }
            if (branchLocationID) {
                await connection.query('UPDATE users SET branch_location_id = $1 WHERE user_id = $2', [branchLocationID, targetUserID]);
            }
            if (dob) {
                await connection.query('UPDATE users SET date_of_birth = $1 WHERE user_id = $2', [dob, targetUserID]);
            }
            if (role) {
                await connection.query('UPDATE users SET role = $1 WHERE user_id = $2', [role, targetUserID]);
            }
            if (email) {
                await connection.query('UPDATE users SET email = $1 WHERE user_id = $2', [email, targetUserID]);
            }
            await connection.query('COMMIT');
        } catch (error) {
            await connection.query('ROLLBACK');
            throw {status: 500, message: 'Failed to update user'};
        } finally {
            connection.release();
        }
    },

    async getUserDetails(userID) {
        const result = await db.query('SELECT first_name, last_name, email, phone, branch_location_id, date_of_birth, role FROM users WHERE user_id = $1', [userID]);

        if (result.rowCount === 0) {
            throw {status: 404, message: 'User not found'};
        }

        return result.rows[0];
    },

    async getAllUsers(currentUserID) {
        // check if the current user is an admin
        const currentUserRole = await this.getUserRole(currentUserID);
        if (currentUserRole !== 'admin') {
            throw {status: 403, message: 'Forbidden'};
        }

        const result = await db.query('SELECT user_id, first_name, last_name, role FROM users');
        return result.rows;
    },

    async getAllUsersPaginated(currentUserID, limit, offset) {
        // check if the current user is an admin
        const currentUserRole = await this.getUserRole(currentUserID);
        if (currentUserRole !== 'admin') {
            throw {status: 403, message: 'Forbidden'};
        }

        const result = await db.query('SELECT user_id, first_name, last_name, role FROM users ORDER BY user_id LIMIT $1 OFFSET $2', [limit, offset]);
        return result.rows;
    }
};