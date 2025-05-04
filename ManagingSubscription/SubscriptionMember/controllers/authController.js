// authController.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key';

// Mock member database
const members = [
  { id: 1, email: 'john@example.com', password: 'password123', role: 'member' },
  { id: 2, email: 'jane@example.com', password: 'password123', role: 'member' },
];

exports.login = (req, res) => {
  const { email, password } = req.body;
  const user = members.find(u => u.email === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
  res.json({ token });
};
