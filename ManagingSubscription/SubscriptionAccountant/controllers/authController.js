// authController.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key';

// simple in-memory accountant users
const accountants = [
  { id: 101, email: 'acct1@example.com', password: 'pass123', role: 'accountant' },
  { id: 102, email: 'acct2@example.com', password: 'pass123', role: 'accountant' },
];

exports.login = (req, res) => {
  const { email, password } = req.body;
  const user = accountants.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
  res.json({ token });
};
