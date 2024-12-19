const { http } = require('@google-cloud/functions-framework');
const userApp = require('./index');

http('handleUserRequests', userApp);

exports.handleUserRequests = userApp;