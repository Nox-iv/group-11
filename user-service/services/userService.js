const pool = require('../db/pool');
const { generateVerificationCode } = require('./codeGenerator');
const { sendVerificationEmail } = require('./emailService');
const { registerCredentials, checkPassword, updatePassword } = require('./authServiceClient');

exports.registerUser = async ({ fname, sname, email, phone, branchLocationID, dob, password }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if email exists
    const existing = await client.query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (existing.rowCount) throw new Error('Email already in use');

    // Insert user
    const insertUserQuery = `
      INSERT INTO users (first_name, last_name, email, phone, branch_location_id, date_of_birth)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING user_id
    `;
    const userRes = await client.query(insertUserQuery, [fname, sname, email, phone, branchLocationID, dob]);
    const userId = userRes.rows[0].user_id;

    // Register credentials with Auth service
    await registerCredentials(userId, password);

    // Generate verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await client.query(
      `INSERT INTO verification_codes (verification_code, user_id, expires_at) VALUES ($1, $2, $3)`,
      [code, userId, expiresAt]
    );

    // Send email
    await sendVerificationEmail(email, code);

    await client.query('COMMIT');
    return { userId };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

exports.loginUser = async ({ email, password }) => {
  const client = await pool.connect();
  try {
    const userRes = await client.query(`
      SELECT user_id, is_verified, branch_location_id, user_role
      FROM users
      WHERE email = $1
    `, [email]);

    if (!userRes.rowCount) throw new Error('Invalid email or password');
    const { user_id, is_verified, branch_location_id, user_role } = userRes.rows[0];

    // Check password with Auth service
    const { valid } = await checkPassword(user_id, password);
    if (!valid) throw new Error('Invalid email or password');

    if (!is_verified) {
      // Check if code is valid or expired
      const codeRes = await client.query(`
        SELECT verification_code, expires_at
        FROM verification_codes
        WHERE user_id = $1 AND used = false
        ORDER BY created_at DESC
        LIMIT 1
      `, [user_id]);
      if (!codeRes.rowCount) {
        // Generate new code if none
        await regenerateCode(client, user_id, email);
        return { message: 'Account not verified. New code sent.' };
      } else {
        const { verification_code, expires_at } = codeRes.rows[0];
        if (new Date() > new Date(expires_at)) {
          // Expired, remove old code & generate new
          await client.query('DELETE FROM verification_codes WHERE verification_code = $1', [verification_code]);
          await regenerateCode(client, user_id, email);
          return { message: 'Verification code expired. New code sent.' };
        }
        return { message: 'Account not verified. Check your email for the verification link.' };
      }
    }

    return {
      userId: user_id,
      branchLocationId: branch_location_id,
      role: user_role,
      message: 'Login successful',
    };
  } finally {
    client.release();
  }
};

async function regenerateCode(client, userId, userEmail) {
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await client.query('INSERT INTO verification_codes (verification_code, user_id, expires_at) VALUES ($1, $2, $3)', [
    code,
    userId,
    expiresAt,
  ]);
  await sendVerificationEmail(userEmail, code);
}

exports.verifyEmail = async (code) => {
  const client = await pool.connect();
  try {
    const codeRes = await client.query(`
      SELECT user_id, expires_at, used
      FROM verification_codes
      WHERE verification_code = $1
    `, [code]);

    if (!codeRes.rowCount) throw new Error('Invalid verification code');
    const { user_id, expires_at, used } = codeRes.rows[0];

    if (used) throw new Error('Code already used');
    if (new Date() > new Date(expires_at)) {
      // Expired, remove code and generate new for user
      await client.query('DELETE FROM verification_codes WHERE verification_code = $1', [code]);
      await regenerateCode(client, user_id, (await getUserEmailById(client, user_id)));
      throw new Error('Code expired. A new verification link has been sent.');
    }

    await client.query('BEGIN');
    await client.query('UPDATE verification_codes SET used = true WHERE verification_code = $1', [code]);
    await client.query('UPDATE users SET is_verified = true WHERE user_id = $1', [user_id]);
    await client.query('COMMIT');

    return { message: 'Email verified successfully' };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

exports.checkUserExists = async (userId) => {
  const { rows } = await pool.query(`SELECT user_id FROM users WHERE user_id = $1`, [userId]);
  return rows.length > 0;
};

async function getUserEmailById(client, userId) {
  const { rows } = await client.query(`SELECT email FROM users WHERE user_id = $1`, [userId]);
  return rows[0]?.email;
}
exports.getUserEmailById = getUserEmailById;

exports.getUserRole = async (userId) => {
  const { rows } = await pool.query(`SELECT user_role FROM users WHERE user_id = $1`, [userId]);
  return rows[0]?.user_role;
};

exports.getUserDetails = async (userId) => {
  const { rows } = await pool.query(`
    SELECT first_name, last_name, email, phone, branch_location_id, date_of_birth, user_role, is_verified
    FROM users
    WHERE user_id = $1
  `, [userId]);
  if (!rows.length) throw new Error('User not found');
  return rows[0];
};

exports.userUpdateSelf = async (userId, { fname, sname, phone }) => {
  const fields = [];
  const values = [];
  if (fname) { fields.push('first_name'); values.push(fname); }
  if (sname) { fields.push('last_name'); values.push(sname); }
  if (phone) { fields.push('phone'); values.push(phone); }

  if (!fields.length) return { message: 'No fields to update' };

  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
  await pool.query(`UPDATE users SET ${setClause}, updated_at = now() WHERE user_id = $${fields.length + 1}`, [...values, userId]);
  return { message: 'User updated successfully' };
};

exports.userUpdatePassword = async (userId, oldPassword, newPassword) => {
  const result = await updatePassword(userId, oldPassword, newPassword);
  if (!result.success) throw new Error(result.message || 'Password update failed');
  return { message: 'Password updated successfully' };
};

exports.adminUpdateUser = async (adminId, targetUserId, updates) => {
  const adminRole = await this.getUserRole(adminId);
  if (adminRole !== 'admin') throw new Error('Access denied');
  
  const fields = [];
  const values = [];
  if (updates.fname) { fields.push('first_name'); values.push(updates.fname); }
  if (updates.sname) { fields.push('last_name'); values.push(updates.sname); }
  if (updates.phone) { fields.push('phone'); values.push(updates.phone); }
  if (updates.branchLocationID) { fields.push('branch_location_id'); values.push(updates.branchLocationID); }
  if (updates.dob) { fields.push('date_of_birth'); values.push(updates.dob); }
  if (updates.role) { fields.push('user_role'); values.push(updates.role); }
  if (updates.email) { fields.push('email'); values.push(updates.email); }

  if (!fields.length) return { message: 'No fields to update' };
  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
  
  await pool.query(`UPDATE users SET ${setClause}, updated_at = now() WHERE user_id = $${fields.length + 1}`, [...values, targetUserId]);
  return { message: 'User updated by admin' };
};

exports.getAllUsers = async (adminId) => {
  const adminRole = await this.getUserRole(adminId);
  if (adminRole !== 'admin') throw new Error('Access denied');
  const { rows } = await pool.query(`SELECT * FROM users`);
  return rows;
};

exports.getAllUsersPaginated = async (adminId, limit, offset) => {
  const adminRole = await this.getUserRole(adminId);
  if (adminRole !== 'admin') throw new Error('Access denied');
  const { rows } = await pool.query(`SELECT * FROM users ORDER BY user_id LIMIT $1 OFFSET $2`, [limit, offset]);
  return rows;
};
