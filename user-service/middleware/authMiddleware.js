const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'nokey';

module.exports = (req, res, next) => {
  try {
    const header = req.headers['authorization'] || '';
    const token = header.startsWith('Bearer ') ? header.substring(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - no token provided' });
    }

    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
