const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/verify-email', userController.verifyEmail);
router.post('/get-user-role', userController.getUserRole);
router.post('/get-user-email', userController.getUserEmail);
router.post('/check-user-exists', userController.checkUserIdExists);
router.post('/user-update-self', userController.userUpdateUser);
router.post('/admin-update-user', userController.adminUpdateUser);
router.post('/get-user-details', userController.getUserDetails);
router.post('/get-all-users', userController.getAllUsers);
router.post('/get-all-users-paginated', userController.getAllUsersPaginated);

module.exports = router;