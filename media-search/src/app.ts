import express from 'express';
import cors from 'cors';
import setup from './setup';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

const { mediaSearchApi } = setup();

app.post('/search', async (req, res) => mediaSearchApi.searchMedia(req, res));
app.get('/filters', async (req, res) => mediaSearchApi.getSearchFilters(req, res));
app.get('/search/:mediaId', async (req, res) => mediaSearchApi.getMediaById(req, res));

export default app;
