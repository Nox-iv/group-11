const { register, checkPassword, updateUserPassword, getUserRole } = require('../services/authService');
const { generateToken } = require('../utils/token');

exports.registerCredentials = async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) return res.status(400).json({ error: 'Missing userId or password' });

    const result = await register(userId, password);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.checkPassword = async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) return res.status(400).json({ valid: false, error: 'Missing userId or password' });

    const result = await checkPassword(userId, password);

    if (!result.valid) {
      return res.status(401).json({ valid: false, error: 'Invalid credentials' });
    }

    const role = await getUserRole(userId);

    const token = generateToken({ userId, role: role});

    res.json({ valid: true, token });

  } catch (err) {
    console.error(err);
    res.status(400).json({ valid: false, error: err.message });
  }
};

exports.updateUserPassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await updateUserPassword(userId, oldPassword, newPassword);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
