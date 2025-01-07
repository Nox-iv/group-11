const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors({ origin: '*' }));

app.use(express.json());

app.use('/', userRoutes);

module.exports = app;
