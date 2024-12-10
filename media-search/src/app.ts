import express from 'express';
import functions from '@google-cloud/functions-framework';
import setup from './setup';

const app = express();

const { mediaSearchApi } = setup();

app.get('/search', mediaSearchApi.searchMedia);

export default app;