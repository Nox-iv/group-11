const pool = require('../db/pool');
const bcrypt = require('bcrypt');

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;

exports.register = async (userId, password) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if credentials already exist
    const checkRes = await client.query(`
      SELECT user_id FROM user_credentials WHERE user_id = $1
    `, [userId]);
    if (checkRes.rowCount > 0) throw new Error('Credentials already exist for this user.');

    // Hash and insert
    const hash = await bcrypt.hash(password, saltRounds);
    await client.query(`
      INSERT INTO user_credentials (user_id, password_hash)
      VALUES ($1, $2)
    `, [userId, hash]);

    await client.query('COMMIT');
    return { success: true, message: 'User credentials registered.' };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

exports.checkPassword = async (userId, password) => {
  const res = await pool.query(`
    SELECT password_hash FROM user_credentials WHERE user_id = $1
  `, [userId]);
  if (res.rowCount === 0) return { valid: false };

  const { password_hash } = res.rows[0];
  const isMatch = await bcrypt.compare(password, password_hash);
  return { valid: isMatch };
};

exports.updateUserPassword = async (userId, oldPassword, newPassword) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const res = await client.query(`
      SELECT password_hash FROM user_credentials WHERE user_id = $1
    `, [userId]);
    if (res.rowCount === 0) throw new Error('User credentials not found.');

    const { password_hash } = res.rows[0];
    const isMatch = await bcrypt.compare(oldPassword, password_hash);
    if (!isMatch) throw new Error('Old password is incorrect.');

    const newHash = await bcrypt.hash(newPassword, saltRounds);
    await client.query(`
      UPDATE user_credentials
      SET password_hash = $1, updated_at = now()
      WHERE user_id = $2
    `, [newHash, userId]);

    await client.query('COMMIT');
    return { success: true, message: 'Password updated successfully.' };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
