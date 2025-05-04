// authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key'; // ideally from process.env

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
};
