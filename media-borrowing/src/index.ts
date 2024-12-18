import functions from '@google-cloud/functions-framework';
import { createApp } from './app/app';

const app = createApp();

functions.http('mediaBorrowing', app);