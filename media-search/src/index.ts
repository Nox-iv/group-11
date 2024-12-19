import app from './app';
import { http } from '@google-cloud/functions-framework';

http('mediaSearch', app);
