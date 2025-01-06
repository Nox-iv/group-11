const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.AUTH_SERVICE_API_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

router.use(apiKeyMiddleware);

router.post('/register', authController.registerCredentials);
router.post('/check-password', authController.checkPassword);
router.patch('/update-user-password', authController.updateUserPassword);

module.exports = router;
