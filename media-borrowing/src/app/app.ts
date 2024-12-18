import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { Pool } from 'pg';

import { requestContextMiddleware } from './middleware/context/requestContextMiddleware';

import { borrowMediaItem, renewMediaItemHandler, returnMediaItemHandler } from './handlers/mediaBorrowing';
import { getBranchesByLocationId } from './handlers/amlBranchReader';
import { getMediaBorrowingRecordsForUser } from './handlers/mediaBorrowingReader';

import { setup } from './setup';    

export function createApp() {
    const pool = new Pool();

    setup(pool);

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    const withRequestContext = (handler: (req: Request, res: Response, next: NextFunction) => void) => {
        return (req: Request, res: Response, next: NextFunction) => {
            requestContextMiddleware(req, res, () => handler(req, res, next))
        }
    }

    app.post('/borrow', withRequestContext(borrowMediaItem));
    app.post('/renew', withRequestContext(renewMediaItemHandler));
    app.post('/return', withRequestContext(returnMediaItemHandler));
    app.get('/user/:userId/records', withRequestContext(getMediaBorrowingRecordsForUser));
    app.get('/location/:locationId/branches', withRequestContext(getBranchesByLocationId));

    return app
}