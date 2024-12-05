import { setup } from './app/setup';
import supertest from 'supertest';
import { Pool } from 'pg';
import * as functions from '@google-cloud/functions-framework';
import express from 'express';
import bodyParser from 'body-parser';
import { borrowMediaItem, renewMediaItemHandler, returnMediaItemHandler } from './app/handlers/mediaBorrowing';
import { GetMediaBorrowingRecordsForUser } from './app/handlers/mediaBorrowingReader';
import { requestContextMiddleware } from './app/middleware/context/requestContextMiddleware';
import { Request as GCloudRequest, Response as GCloudResponse } from '@google-cloud/functions-framework';

describe('Media Borrowing Integration Tests', () => {
  let app: express.Application;
  let pool: Pool;

  beforeAll(async () => {
    pool = new Pool();
    setup(pool);

    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    const withMiddleware = (handler: functions.HttpFunction) => {
      return async (req: express.Request, res: express.Response) => {
        await requestContextMiddleware(
          req as unknown as GCloudRequest, 
          res as unknown as GCloudResponse, 
          async () => {
            await handler(req as unknown as GCloudRequest, res as unknown as GCloudResponse);
          }
        );
      };
    };

    app.post('/borrowMediaItem', withMiddleware(borrowMediaItem));
    app.post('/renewMediaItem', withMiddleware(renewMediaItemHandler));
    app.post('/returnMediaItem', withMiddleware(returnMediaItemHandler));
    app.get('/GetMediaBorrowingRecordsForUser', withMiddleware(GetMediaBorrowingRecordsForUser));
  });

  describe('borrowMediaItem', () => {
    it('should successfully borrow a media item', async () => {

      const response = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: '1',
          mediaId: '1',
          branchId: '1',
          startDate: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(new Date().setHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 14).toISOString()
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')

      console.log(response.body)
      expect(response.status).toBe(200);
    });
  });
});
