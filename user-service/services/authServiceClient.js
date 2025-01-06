const axios = require('axios');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const AUTH_SERVICE_API_KEY = process.env.AUTH_SERVICE_API_KEY;

exports.registerCredentials = async (userId, password) => {
  await axios.post(`${AUTH_SERVICE_URL}/register`, {
    userId,
    password,
  }, {
    headers: { 'x-api-key': AUTH_SERVICE_API_KEY },
  });
};

exports.checkPassword = async (userId, password) => {
  const res = await axios.post(`${AUTH_SERVICE_URL}/check-password`, {
    userId,
    password,
  }, {
    headers: { 'x-api-key': AUTH_SERVICE_API_KEY },
  });
  return res.data;
};

exports.updatePassword = async (userId, oldPassword, newPassword) => {
  const res = await axios.patch(`${AUTH_SERVICE_URL}/update-user-password`, {
    userId,
    oldPassword,
    newPassword,
  }, {
    headers: { 'x-api-key': AUTH_SERVICE_API_KEY },
  });
  return res.data;
};
