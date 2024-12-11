import express from 'express';
import setup from './setup';

const app = express();

const { mediaSearchApi } = setup();

app.get('/search', async (req, res) => mediaSearchApi.searchMedia(req, res));

export default app;