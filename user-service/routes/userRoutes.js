const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY_USER_SERVICE) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

router.use(apiKeyMiddleware);

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/verify-email/:code', userController.verifyEmail);

router.use(authMiddleware);

router.get('/check-user-exists', userController.checkUserExists);
router.get('/get-user-email', userController.getUserEmail);
router.get('/get-user-role', userController.getUserRole);
router.get('/get-user-details', userController.getUserDetails);

router.patch('/user-update-self', userController.userUpdateSelf);
router.patch('/user-update-password', userController.userUpdatePassword);
router.patch('/admin-update-user', userController.adminUpdateUser);

router.get('/get-all-users', userController.getAllUsers);
router.get('/get-all-users-paginated', userController.getAllUsersPaginated);

module.exports = router;
