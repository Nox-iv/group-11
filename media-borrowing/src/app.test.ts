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


//TODO: Current test setup works but is fragile - clean up tests and use a more reliable seeding method.
describe('Media Borrowing Integration Tests', () => {
  let app: express.Application;
  let pool: Pool;
  let baseDate: Date;
  let mediaBorrowingId: number = 0;

  const DATABASE = {
    USERS: {
      SHEFFIELD_USER_1: 1,
      SHEFFIELD_USER_2: 2,
      MANCHESTER_USER: 3
    },
    MEDIA: {
      GATSBY: 1,
      INCEPTION: 2,
      HOBBIT: 3
    },
    BRANCHES: {
      SHEFFIELD_CENTRAL: 1,
      SHEFFIELD_SOUTH: 2,
      MANCHESTER_CENTRAL: 3
    },
    MEDIA_BORROWING_ID : () => {
      return mediaBorrowingId += 1;
    }
  }

  beforeAll(async () => {
    pool = new Pool();
    setup(pool);

    baseDate = new Date();

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

  describe('Media borrowing, renewals, and returns', () => {
    it('A user can borrow a media item, renew the borrowing period once, and return the media item', async () => {
      // Borrow media item
      const borrowResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.GATSBY,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(borrowResponse.status).toBe(200);
      const mediaBorrowingRecordId = DATABASE.MEDIA_BORROWING_ID();

      // Renew media item
      const renewResponse = await supertest(app)
        .post('/renewMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId,
          renewedEndDate: new Date(new Date().setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 14).toISOString()
        })

      expect(renewResponse.status).toBe(200);

      // Return media item
      const returnResponse = await supertest(app)
        .post('/returnMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId
        })

      expect(returnResponse.status).toBe(200);
    })

    it('Two users can borrow the same media item from the same branch, renew each item, and then return their media items', async () => {
      // Borrow media item - user 1
      const borrowResponse1 = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(borrowResponse1.status).toBe(200);

      const mediaBorrowingRecordId1 = DATABASE.MEDIA_BORROWING_ID();

      // Borrow media item - user 2
      const borrowResponse2 = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_2,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 5)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 5) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(borrowResponse2.status).toBe(200);

      const mediaBorrowingRecordId2 = DATABASE.MEDIA_BORROWING_ID();

      // Renew media item - user 1
      const renewResponse1 = await supertest(app)
        .post('/renewMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId1,
          renewedEndDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 14).toISOString()
        })

      expect(renewResponse1.status).toBe(200);

      // Renew media item - user 2
      const renewResponse2 = await supertest(app)
        .post('/renewMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId2,
          renewedEndDate: new Date(baseDate.setUTCHours(15, 0, 0, 5) + 1000 * 60 * 60 * 24 * 14).toISOString()
        })

      expect(renewResponse2.status).toBe(200);

      // Return media item - user 1
      const returnResponse1 = await supertest(app)
        .post('/returnMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId1
        })

      expect(returnResponse1.status).toBe(200);

      // Return media item - user 2
      const returnResponse2 = await supertest(app)
        .post('/returnMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId2
        })

      expect(returnResponse2.status).toBe(200);
    })

  it('If a user borrows the last copy of a media item from a branch, other users can borrow from a different branch where it is available', async () => {
      // Make item unavailable at Sheffield Central
      const user1BorrowResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.GATSBY,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(user1BorrowResponse.status).toBe(200);

      const mediaBorrowingRecordId = DATABASE.MEDIA_BORROWING_ID();

      // Different user tries to borrow from Sheffield Central but fails
      const user2UnavailableResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_2,
          mediaId: DATABASE.MEDIA.GATSBY,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(user2UnavailableResponse.status).toBe(400);

      // User can borrow from Sheffield South where it is available
      const user2AvailableResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_2,
          mediaId: DATABASE.MEDIA.GATSBY,
          branchId: DATABASE.BRANCHES.SHEFFIELD_SOUTH,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(user2AvailableResponse.status).toBe(200);
      const user2MediaBorrowingRecordId = DATABASE.MEDIA_BORROWING_ID();

      // Reset DB state
      const user1ReturnResponse = await supertest(app)
        .post('/returnMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId
        })

      expect(user1ReturnResponse.status).toBe(200);

      const user2ReturnResponse = await supertest(app)
        .post('/returnMediaItem')
        .send({
          mediaBorrowingRecordId: user2MediaBorrowingRecordId
        })

      expect(user2ReturnResponse.status).toBe(200);
    })

    it('If a user borrows the last copy of a media item from a branch, and returns it, other users can borrow from the same branch', async () => {
      // Borrow last copy of Gatsby at Sheffield Central
      const initialBorrowResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.GATSBY,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(initialBorrowResponse.status).toBe(200);

      const mediaBorrowingRecordId = DATABASE.MEDIA_BORROWING_ID();

      // Different user tries to borrow gatsby from Sheffield Central but fails
      const user2UnavailableResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_2,
          mediaId: DATABASE.MEDIA.GATSBY,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(user2UnavailableResponse.status).toBe(400);

      // User returns final copy of Gatsby at Sheffield Central
      const returnResponse = await supertest(app)
        .post('/returnMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId
        })

      expect(returnResponse.status).toBe(200);

      // Different user can now borrow  gatsby from Sheffield Central
      const user2AvailableResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_2,
          mediaId: DATABASE.MEDIA.GATSBY,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(user2AvailableResponse.status).toBe(200);
      const user2MediaBorrowingRecordId = DATABASE.MEDIA_BORROWING_ID()

      const user2ReturnResponse = await supertest(app)
        .post('/returnMediaItem')
        .send({
          mediaBorrowingRecordId: user2MediaBorrowingRecordId
        })

      expect(user2ReturnResponse.status).toBe(200);
    })

    it('A media item that does not exist cannot be borrowed', async () => {
      // Borrow media item that does not exist
      const borrowResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: 999999,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(borrowResponse.status).toBe(400);
    })

    it('A media item that is not in stock at a given branch cannot be borrowed', async () => {
      // Borrow media item that is not in stock at a given branch
      const borrowResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.MANCHESTER_USER,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.MANCHESTER_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(borrowResponse.status).toBe(400);
    })

    it('A user cannot borrow a media item that they have already borrowed, whether that be the same branch or a different branch', async () => {
      // Borrow media item
      const initialBorrowResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(initialBorrowResponse.status).toBe(200);
      const mediaBorrowingRecordId = DATABASE.MEDIA_BORROWING_ID();

      // Borrow media item again from same branch
      const secondBorrowResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(secondBorrowResponse.status).toBe(400);

      // Borrow media item again from different branch
      const thirdBorrowResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_SOUTH,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(thirdBorrowResponse.status).toBe(400);

      const returnResponse = await supertest(app)
        .post('/returnMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId
        })

      expect(returnResponse.status).toBe(200);
    })

    it('A user cannot borrow a media item if the end date is before the start date', async () => {
      // Borrow media item with end date before start date
      const borrowResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) - 1000 * 60 * 60 * 24).toISOString()
        })

      expect(borrowResponse.status).toBe(400);
    })

    it('A user cannot borrow a media item if the end date is outside branch opening hours', async () => {
      // Borrow media item otuside branch hours (Mon-Sun : 0900-1700)
      const borrowResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(4, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(borrowResponse.status).toBe(400);
    })
    
    it('A user cannot borrow a media item if the start date is outside branch opening hours', async () => {
      // Borrow media item outside branch hours (Mon-Sun : 0900-1700)
      const borrowResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(4, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 6).toISOString()
        })

      expect(borrowResponse.status).toBe(400);
    })

    it('If a branch has more than one opening period, then a media item can be borrowed with start/end dates within each period', async () => {
      // Borrow media item within branch opening hours (Mon-Sun : 0000-0200,0900-1700)
      const borrowAfternoonResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(12, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 6).toISOString()
        })

      expect(borrowAfternoonResponse.status).toBe(200);
      const mediaBorrowingRecordId = DATABASE.MEDIA_BORROWING_ID();

      const borrowMorningResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.GATSBY,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(1, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(1, 59, 0, 0) + 1000 * 60 * 60 * 24 * 6).toISOString()
        })

      expect(borrowMorningResponse.status).toBe(200);
      const mediaBorrowingRecordId2 = DATABASE.MEDIA_BORROWING_ID();

      const returnResponse = await supertest(app)
        .post('/returnMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId
        })

      expect(returnResponse.status).toBe(200);

      const returnResponse2 = await supertest(app)
        .post('/returnMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId2
        })

      expect(returnResponse2.status).toBe(200);
    })

    it('A media item cannot be borrowed for longer than a branch\'s maximum borrowing duration as specified in the media borrowing config', async () => {
      const borrowResponse14DaysMaxBranch = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 15).toISOString()
        })

      expect(borrowResponse14DaysMaxBranch.status).toBe(400);

      const borrowResponse7DaysMaxBranch = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_SOUTH,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 8).toISOString()
        })

      expect(borrowResponse7DaysMaxBranch.status).toBe(400);
    })

    it('A non-existent media borrowing record cannot be renewed', async () => {
      const renewResponse = await supertest(app)
        .post('/renewMediaItem')
        .send({
          mediaBorrowingRecordId: 999999,
          renewedEndDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 14).toISOString()
        })

      expect(renewResponse.status).toBe(400);
    })

    it('A media borrowing record cannot be renewed more times than the renewal limit specified in the given branch\'s media borrowing config', async () => {
      const borrowResponseMaxOneRenewal = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(borrowResponseMaxOneRenewal.status).toBe(200);
      const mediaBorrowingRecordId = DATABASE.MEDIA_BORROWING_ID();

      const renewResponseMaxOneAllowedSuccess = await supertest(app)
        .post('/renewMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId,
          renewedEndDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 14).toISOString()
        })

      expect(renewResponseMaxOneAllowedSuccess.status).toBe(200);

      const renewResponseMaxOneAllowedFailure = await supertest(app)
        .post('/renewMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId,
          renewedEndDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 28).toISOString()
        })

      expect(renewResponseMaxOneAllowedFailure.status).toBe(400);

      const returnResponseMaxOneRenewal = await supertest(app)
        .post('/returnMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId
        })

      expect(returnResponseMaxOneRenewal.status).toBe(200);

      const borrowResponseMaxTwoRenewals = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_SOUTH,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(borrowResponseMaxTwoRenewals.status).toBe(200);
      const mediaBorrowingRecordId2 = DATABASE.MEDIA_BORROWING_ID();

      const renewResponseMaxTwoAllowedSuccess = await supertest(app)
        .post('/renewMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId2,
          renewedEndDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 14).toISOString()
        })

      expect(renewResponseMaxTwoAllowedSuccess.status).toBe(200);

      const renewResponseMaxTwoAllowedSuccess2 = await supertest(app)
        .post('/renewMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId2,
          renewedEndDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 21).toISOString()
        })

      expect(renewResponseMaxTwoAllowedSuccess2.status).toBe(200);

      const renewResponseMaxTwoAllowedFailure = await supertest(app)
        .post('/renewMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId2,
          renewedEndDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 28).toISOString()
        })

      expect(renewResponseMaxTwoAllowedFailure.status).toBe(400);

      const returnResponseMaxTwoRenewals = await supertest(app)
        .post('/returnMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId2
        })

      expect(returnResponseMaxTwoRenewals.status).toBe(200);
    })

    it('A media item cannot be renewed if the renewed end date is before the previous end date', async () => {
      const borrowResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(borrowResponse.status).toBe(200);
      const mediaBorrowingRecordId = DATABASE.MEDIA_BORROWING_ID();

      const renewResponse = await supertest(app)
        .post('/renewMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId,
          renewedEndDate: new Date(baseDate.setUTCHours(14, 0, 0, 0) - 1000 * 60 * 60 * 7).toISOString()
        })

      expect(renewResponse.status).toBe(400);

      const returnResponse = await supertest(app)
        .post('/returnMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId
        })

      expect(returnResponse.status).toBe(200);
    })

    it('A media item cannot be renewed if the renewed end date is outside the branch\'s opening hours', async () => {
      const borrowResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(borrowResponse.status).toBe(200);
      const mediaBorrowingRecordId = DATABASE.MEDIA_BORROWING_ID();

      const renewResponse = await supertest(app)
        .post('/renewMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId,
          renewedEndDate: new Date(baseDate.setUTCHours(4, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(renewResponse.status).toBe(400);

      const returnResponse = await supertest(app)
        .post('/returnMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId
        })

      expect(returnResponse.status).toBe(200);
    })

    it('A media item cannot be renewed if the renewed borrowing duration is longer than the branch\'s maximum borrowing duration', async () => {
      const borrowResponse = await supertest(app)
        .post('/borrowMediaItem')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(borrowResponse.status).toBe(200);
      const mediaBorrowingRecordId = DATABASE.MEDIA_BORROWING_ID();

      const renewResponse = await supertest(app)
        .post('/renewMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId,
          renewedEndDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 22).toISOString()
        })

      expect(renewResponse.status).toBe(400);

      const returnResponse = await supertest(app)
        .post('/returnMediaItem')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId
        })

      expect(returnResponse.status).toBe(200);
    })
  })
});

 