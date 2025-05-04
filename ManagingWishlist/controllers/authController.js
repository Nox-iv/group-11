const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // For hashing passwords in real cases
const SECRET_KEY = "your-secret-key"; // Use env variables in production

// Mock user database (Replace this with a real user service when available)
const users = [
  { id: 1, email: "john@example.com", password: "password123" },
  { id: 2, email: "jane@example.com", password: "password123" }
];

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Simulate password check (in real cases, use bcrypt.compare)
  if (password !== user.password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Generate JWT token
  const token = jwt.sign({ email: user.email, id: user.id }, SECRET_KEY, {
    expiresIn: "1h"
  });

  res.json({ token });
};
