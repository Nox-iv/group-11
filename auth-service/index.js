const functions = require('@google-cloud/functions-framework');
const app = require('./app');

// Export the HTTP-triggered function
functions.http('authService', (req, res) => {
  app(req, res);
});
