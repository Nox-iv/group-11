import app from './app';
import functions from '@google-cloud/functions-framework';

functions.http('mediaSearch', app);
