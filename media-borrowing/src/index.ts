import functions from '@google-cloud/functions-framework';
import { Pool } from 'pg';
import { GetMediaBorrowingRecordsForUser } from './app/handlers/mediaBorrowingReader';
import { borrowMediaItem, renewMediaItemHandler, returnMediaItemHandler } from './app/handlers/mediaBorrowing';
import { setup } from './app/setup';
import { requestContextMiddleware } from './app/middleware/context/requestContextMiddleware';

const pool = new Pool();

setup(pool);

const runMiddleware = (handler: functions.HttpFunction): functions.HttpFunction => {
    return async (req, res) => {
        await requestContextMiddleware(req, res, async () => {
            await handler(req, res);
        });
    };
};

functions.http('borrowMediaItem', runMiddleware(borrowMediaItem));
functions.http('renewMediaItem', runMiddleware(renewMediaItemHandler));
functions.http('returnMediaItem', runMiddleware(returnMediaItemHandler));
functions.http('GetMediaBorrowingRecordsForUser', runMiddleware(GetMediaBorrowingRecordsForUser));