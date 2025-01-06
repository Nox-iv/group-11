const Joi = require('joi');

const userRegisterSchema = Joi.object({
  fname: Joi.string().trim().required(),
  sname: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  branchLocationID: Joi.number().integer().required(),
  dob: Joi.date().iso().required()
    .custom((value, helpers) => {
      const ageDifMs = Date.now() - new Date(value).getTime();
      const ageDate = new Date(ageDifMs);
      const userAge = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (userAge < 18) return helpers.error('any.invalid');
      return value;
    }, 'Age validation'),
  password: Joi.string().min(6).required(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  userRegisterSchema,
  userLoginSchema,
};
