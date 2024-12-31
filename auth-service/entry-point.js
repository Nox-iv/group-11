const { http } = require('@google-cloud/functions-framework');
const authApp = require('./index');

http('handleAuthRequests', authApp);

exports.handleAuthRequests = authApp;
