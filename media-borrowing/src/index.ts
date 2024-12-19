import { http } from '@google-cloud/functions-framework';
import { createApp } from './app/app';

const app = createApp();

http('mediaBorrowing', app);
