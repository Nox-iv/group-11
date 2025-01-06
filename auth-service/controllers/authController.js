const { register, checkPassword, updateUserPassword } = require('../services/authService');

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
    res.json(result);
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
