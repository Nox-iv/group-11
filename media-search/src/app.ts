import express from 'express';
import setup from './setup';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { mediaSearchApi } = setup();

app.post('/search', async (req, res) => mediaSearchApi.searchMedia(req, res));

export default app;