const userService = require('../services/user-service');
const Joi = require('joi');
const { handleError } = require('../utils/error-handler');

module.exports = {

    register: async (req, res) => {
        try {
            const { fname, sname, email, phone, branchLocationID, dob, password } = req.body;
            const schema = Joi.object({
                fname: Joi.string().required(),
                sname: Joi.string().required(),
                email: Joi.string().email().required(),
                phone: Joi.string().required(),
                branchLocationID: Joi.number().required(),
                dob: Joi.date().required(),
                password: Joi.string().required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return handleError(res, error.details[0].message, 400);
            }
            const user = await userService.register({fname, sname, email, phone, branchLocationID, dob, password});
            res.json(user);
        } catch (error) {
            handleError(res, error.message, 500);
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return handleError(res, error.details[0].message, 400);
            }
            const user = await userService.login(email, password);
            res.json(user);
        } catch (error) {
            handleError(res, error.message, 500);
        }
    },

    verifyEmail: async (req, res) => {
        try {
            const { verificationCode } = req.body;
            const schema = Joi.object({
                verificationCode: Joi.string().required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return handleError(res, error.details[0].message, 400);
            }
            const response = await userService.verifyEmail(verificationCode);
            res.json(response);
        } catch (error) {
            handleError(res, error.message, 500);
        }
    },

    getUserRole: async (req, res) => {
        try {
            const { userId } = req.params;
            const schema = Joi.object({
                userId: Joi.number().required()
            });
            const { error } = schema.validate(req.params);
            if (error) {
                return handleError(res, error.details[0].message, 400);
            }
            const role = await userService.getUserRole(userId);
            res.json(role);
        } catch (error) {
            handleError(res, error.message, 500);
        }
    },

    getUserEmail: async (req, res) => {
        try {
            const { userId } = req.params;
            const schema = Joi.object({
                userId: Joi.number().required()
            });
            const { error } = schema.validate(req.params);
            if (error) {
                return handleError(res, error.details[0].message, 400);
            }
            const email = await userService.getUserEmail(userId);
            res.json(email);
        } catch (error) {
            handleError(res, error.message, 500);
        }
    },

    checkUserIdExists: async (req, res) => {
        try {
            const { userId } = req.params;
            const schema = Joi.object({
                userId: Joi.number().required()
            });
            const { error } = schema.validate(req.params);
            if (error) {
                return handleError(res, error.details[0].message, 400);
            }
            const exists = await userService.checkUserIdExists(userId);
            res.json(exists);
        } catch (error) {
            handleError(res, error.message, 500);
        }
    },

    userUpdateUser: async (req, res) => {
        try {
            const { userID, fname, sname, phone } = req.body;
            const schema = Joi.object({
                userID: Joi.number().required(),
                fname: Joi.string().optional(),
                sname: Joi.string().optional(),
                phone: Joi.string().optional()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return handleError(res, error.details[0].message, 400);
            }
            await userService.userUpdateUser({userID, fname, sname, phone});
            res.json('User updated');
        } catch (error) {
            handleError(res, error.message, 500);
        }
    },

    adminUpdateUser: async (req, res) => {
        try {
            const { currentUserID, targetUserID, fname, sname, phone, branchLocationID, dob, role, email } = req.body;
            const schema = Joi.object({
                currentUserID: Joi.number().required(),
                targetUserID: Joi.number().required(),
                fname: Joi.string().optional(),
                sname: Joi.string().optional(),
                phone: Joi.string().optional(),
                branchLocationID: Joi.number().optional(),
                dob: Joi.date().optional(),
                role: Joi.string().optional(),
                email: Joi.string().optional()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return handleError(res, error.details[0].message, 400);
            }
            await userService.adminUpdateUser({currentUserID, targetUserID, fname, sname, phone, branchLocationID, dob, role, email});
            res.json('User updated');
        } catch (error) {
            handleError(res, error.message, 500);
        }
    },

    getUserDetails: async (req, res) => {
        try {
            const { userID } = req.params;
            const schema = Joi.object({
                userID: Joi.number().required()
            });
            const { error } = schema.validate(req.params);
            if (error) {
                return handleError(res, error.details[0].message, 400);
            }
            const details = await userService.getUserDetails(userID);
            res.json(details);
        } catch (error) {
            handleError(res, error.message, 500);
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const { currentUserID } = req.body;
            const schema = Joi.object({
                currentUserID: Joi.number().required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return handleError(res, error.details[0].message, 400);
            }
            const users = await userService.getAllUsers(currentUserID);
            res.json(users);
        } catch (error) {
            handleError(res, error.message, 500);
        }
    },

    getAllUsersPaginated: async (req, res) => {
        try {
            const { currentUserID, limit, offset } = req.body;
            const schema = Joi.object({
                currentUserID: Joi.number().required(),
                limit: Joi.number().required(),
                offset: Joi.number().required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return handleError(res, error.details[0].message, 400);
            }
            const users = await userService.getAllUsersPaginated(currentUserID, limit, offset);
            res.json(users);
        } catch (error) {
            handleError(res, error.message, 500);
        }
    }


};