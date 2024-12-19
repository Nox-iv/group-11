const Joi = require('joi');

const registerSchema = Joi.object({
    userID: Joi.number().required(),
    password: Joi.string().required()
});

const checkPasswordSchema = Joi.object({
    userID: Joi.number().required(),
    password: Joi.string().required()
});

const changePasswordSchema = Joi.object({
    userID: Joi.number().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required()
});

const deleteAccountSchema = Joi.object({
    userID: Joi.number().required()
});

module.exports = {
    registerSchema,
    checkPasswordSchema,
    changePasswordSchema,
    deleteAccountSchema
};
