const functions = require('@google-cloud/functions-framework');
const app = require('./app');

// Wrap the Express app into the Cloud Function
functions.http('userService', (req, res) => {
  app(req, res);
});
