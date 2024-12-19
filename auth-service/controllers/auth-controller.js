const authService = require('../services/auth-service');
const { handleError } = require('../utils/error-handler');
const validate = require('../utils/validation');
const { 
    registerSchema, 
    checkPasswordSchema, 
    changePasswordSchema, 
    deleteAccountSchema 
} = require('../schemas/auth-schemas');

module.exports = {

    register: async (req, res) => {
        try {
            validate(registerSchema, req.body);
            const { userID, password } = req.body;
            const response = await authService.register({ userID, password });
            res.status(response.status).json(response);
        } catch (err) {
            handleError(res, err.message, err.status || 500);
        }
    },

    checkPassword: async (req, res) => {
        try {
            validate(checkPasswordSchema, req.body);
            const { userID, password } = req.body;
            const response = await authService.checkPassword({ userID, password });
            res.status(response.status).json(response);
        } catch (err) {
            handleError(res, err.message, err.status || 500);
        }
    },

    changePassword: async (req, res) => {
        try {
            validate(changePasswordSchema, req.body);
            const { userID, newPassword } = req.body;
            const response = await authService.changePassword({ userID, newPassword });
            res.status(response.status).json(response);
        } catch (err) {
            handleError(res, err.message, err.status || 500);
        }
    },

    deleteAccount: async (req, res) => {
        try {
            validate(deleteAccountSchema, req.body);
            const { userID } = req.body;
            const response = await authService.deleteAccount({ userID });
            res.status(response.status).json(response);
        } catch (err) {
            handleError(res, err.message, err.status || 500);
        }
    }

};
