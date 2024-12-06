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

  describe('Borrowing a media item is succesful when...', () => {
    it('an item is available and the user is eligible to borrow it', async () => {

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

      expect(response.status).toBe(200);
    });

    it('a different item is borrowed by the same user', async () => {
      const response = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: '1',
          mediaId: '2',
          branchId: '1',
          startDate: new Date(new Date().setHours(15, 0, 1, 0)).toISOString(),
          endDate: new Date(new Date().setHours(15, 0, 1, 0) + 1000 * 60 * 60 * 24 * 14).toISOString()
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')

      expect(response.status).toBe(200);
    });

    it('the item borrowed by the previous user is borrowed by a different user', async () => {
      const response = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: '2',
          mediaId: '2',
          branchId: '1',
          startDate: new Date(new Date().setHours(1, 0, 0, 0)).toISOString(),
          endDate: new Date(new Date().setHours(0, 30, 0, 0) + 1000 * 60 * 60 * 24 * 14).toISOString()
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')  

      expect(response.status).toBe(200);
    })

    it('the stock of an item is replenished following a return', async () => {
      // First attempt should fail as item is already borrowed
      let response = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: '2',
          mediaId: '1', 
          branchId: '1',
          startDate: new Date(new Date().setHours(15, 0, 0, 3)).toISOString(),
          endDate: new Date(new Date().setHours(15, 0, 0, 3) + 1000 * 60 * 60 * 24 * 14).toISOString()
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')

      expect(response.status).toBe(400);

      // Return the item
      response = await supertest(app)
        .post('/returnMediaItem')
        .send({
          mediaBorrowingRecordId: 1
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')

      expect(response.status).toBe(200);

      // Should now be able to borrow the item
      response = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: '2',
          mediaId: '1',
          branchId: '1', 
          startDate: new Date(new Date().setHours(15, 0, 0, 4)).toISOString(),
          endDate: new Date(new Date().setHours(15, 0, 0, 4) + 1000 * 60 * 60 * 24 * 14).toISOString()
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')

      expect(response.status).toBe(200);
    })

    it('an item unavailable to borrow at one branch is available to borrow at another', async () => {
      // First attempt should fail as item is already borrowed
      let response = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: '1',
          mediaId: '1',
          branchId: '1',
          startDate: new Date(new Date().setHours(15, 0, 0, 5)).toISOString(),
          endDate: new Date(new Date().setHours(15, 0, 0, 5) + 1000 * 60 * 60 * 24 * 6).toISOString()
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')

      console.log(response.body);
      expect(response.status).toBe(400);

      // Try borrowing from another branch
      response = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: '1',
          mediaId: '1',
          branchId: '2',
          startDate: new Date(new Date().setHours(15, 0, 0, 5)).toISOString(),
          endDate: new Date(new Date().setHours(15, 0, 0, 5) + 1000 * 60 * 60 * 24 * 6).toISOString()
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')

      console.log(response.body);
      expect(response.status).toBe(200);
    })
  });
});
