const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const authTokenMiddleware = require('../middleware/auth-token');

// Apply token middleware to all auth routes
router.use(authTokenMiddleware);

router.post('/register', authController.register);
router.post('/check-password', authController.checkPassword);
router.post('/change-password', authController.changePassword);
router.post('/delete-account', authController.deleteAccount);

module.exports = router;
