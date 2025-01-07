const {
    registerUser, loginUser, verifyEmail, checkUserExists, getUserEmailById,
    getUserRole, getUserDetails, userUpdateSelf, userUpdatePassword, adminUpdateUser,
    getAllUsers, getAllUsersPaginated
  } = require('../services/userService');
  const { userRegisterSchema, userLoginSchema } = require('../utils/validators');
  
  exports.register = async (req, res) => {
    try {
      const { error } = userRegisterSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });
      const result = await registerUser(req.body);
      res.json({ success: true, ...result });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  };
  
  exports.login = async (req, res) => {
    try {
      const { error } = userLoginSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });
      const result = await loginUser(req.body);
      res.json({ success: true, ...result });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  };
  
  exports.verifyEmail = async (req, res) => {
    try {
      const { verificationCode } = req.query;
      const result = await verifyEmail(verificationCode);
      res.json({ success: true, ...result });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  };
  
  exports.checkUserExists = async (req, res) => {
    try {
      const { userId } = req.query;
      const exists = await checkUserExists(req, userId);
      res.json({ exists });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  };
  
  exports.getUserEmail = async (req, res) => {
    try {
      const { userId } = req.query;
      const clientEmail = await getUserEmailById(req, null, userId);
      if (!clientEmail) return res.status(404).json({ error: 'User not found' });
      res.json({ email: clientEmail });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  };
  
  exports.getUserRole = async (req, res) => {
    try {
      const { userId } = req.query;
      const role = await getUserRole(req, userId);
      if (!role) return res.status(404).json({ error: 'User not found' });
      res.json({ role });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  };
  
  exports.getUserDetails = async (req, res) => {
    try {
      const { userId } = req.query;
      const details = await getUserDetails(req, userId);
      res.json(details);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  };
  
  exports.userUpdateSelf = async (req, res) => {
    try {
      const { userId, fname, sname, phone } = req.body;
      const result = await userUpdateSelf(userId, { fname, sname, phone });
      res.json({ success: true, ...result });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  };
  
  exports.userUpdatePassword = async (req, res) => {
    try {
      const { userId, oldPassword, newPassword } = req.body;
      const result = await userUpdatePassword(userId, oldPassword, newPassword);
      res.json({ success: true, ...result });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  };
  
  exports.adminUpdateUser = async (req, res) => {
    try {
      const { adminId, targetUserId, fname, sname, phone, branchLocationID, dob, role, email } = req.body;
      const updates = { fname, sname, phone, branchLocationID, dob, role, email };
      const result = await adminUpdateUser(adminId, targetUserId, updates);
      res.json({ success: true, ...result });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  };
  
  exports.getAllUsers = async (req, res) => {
    try {
      const { adminId } = req.query;
      const result = await getAllUsers(adminId);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  };
  
  exports.getAllUsersPaginated = async (req, res) => {
    try {
      const { adminId, limit, offset } = req.query;
      const result = await getAllUsersPaginated(adminId, parseInt(limit, 10), parseInt(offset, 10));
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  };
  