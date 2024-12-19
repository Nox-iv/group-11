const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth-routes');

const app = express();
app.use(bodyParser.json());

app.use('/', authRoutes);

module.exports = app;
