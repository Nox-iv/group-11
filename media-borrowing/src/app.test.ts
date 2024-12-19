import supertest from 'supertest';
import express from 'express';
import { createApp } from './app/app';

//TODO: Current test setup works but is fragile - clean up tests and use a more reliable seeding method.
describe('Media Borrowing Integration Tests', () => {
  let app: express.Application;

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
    LOCATIONS: {
      SHEFFIELD: 1,
      MANCHESTER: 2
    },
    MEDIA_BORROWING_ID : () => {
      return mediaBorrowingId += 1;
    }
  }

  beforeAll(async () => {
    baseDate = new Date();
    app = createApp()
  });

  describe('Media borrowing, renewals, and returns', () => {
    it('A user can borrow a media item, renew the borrowing period once, and return the media item', async () => {
      // Borrow media item
      const borrowResponse = await supertest(app)
        .post('/borrow')
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
        .post('/renew')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId,
          renewedEndDate: new Date(new Date().setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 14).toISOString()
        })

      expect(renewResponse.status).toBe(200);

      // Return media item
      const returnResponse = await supertest(app)
        .post('/return')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId
        })

      expect(returnResponse.status).toBe(200);
    })

    it('Two users can borrow the same media item from the same branch, renew each item, and then return their media items', async () => {
      // Borrow media item - user 1
      const borrowResponse1 = await supertest(app)
        .post('/borrow')
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
        .post('/borrow')
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
        .post('/renew')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId1,
          renewedEndDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 14).toISOString()
        })

      expect(renewResponse1.status).toBe(200);

      // Renew media item - user 2
      const renewResponse2 = await supertest(app)
        .post('/renew')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId2,
          renewedEndDate: new Date(baseDate.setUTCHours(15, 0, 0, 5) + 1000 * 60 * 60 * 24 * 14).toISOString()
        })

      expect(renewResponse2.status).toBe(200);

      // Return media item - user 1
      const returnResponse1 = await supertest(app)
        .post('/return')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId1
        })

      expect(returnResponse1.status).toBe(200);

      // Return media item - user 2
      const returnResponse2 = await supertest(app)
        .post('/return')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId2
        })

      expect(returnResponse2.status).toBe(200);
    })

  it('If a user borrows the last copy of a media item from a branch, other users can borrow from a different branch where it is available', async () => {
      // Make item unavailable at Sheffield Central
      const user1BorrowResponse = await supertest(app)
        .post('/borrow')
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
        .post('/borrow')
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
        .post('/borrow')
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
        .post('/return')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId
        })

      expect(user1ReturnResponse.status).toBe(200);

      const user2ReturnResponse = await supertest(app)
        .post('/return')
        .send({
          mediaBorrowingRecordId: user2MediaBorrowingRecordId
        })

      expect(user2ReturnResponse.status).toBe(200);
    })

    it('If a user borrows the last copy of a media item from a branch, and returns it, other users can borrow from the same branch', async () => {
      // Borrow last copy of Gatsby at Sheffield Central
      const initialBorrowResponse = await supertest(app)
        .post('/borrow')
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
        .post('/borrow')
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
        .post('/return')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId
        })

      expect(returnResponse.status).toBe(200);

      // Different user can now borrow  gatsby from Sheffield Central
      const user2AvailableResponse = await supertest(app)
        .post('/borrow')
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
        .post('/return')
        .send({
          mediaBorrowingRecordId: user2MediaBorrowingRecordId
        })

      expect(user2ReturnResponse.status).toBe(200);
    })

    it('A media item that does not exist cannot be borrowed', async () => {
      // Borrow media item that does not exist
      const borrowResponse = await supertest(app)
        .post('/borrow')
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
        .post('/borrow')
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
        .post('/borrow')
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
        .post('/borrow')
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
        .post('/borrow')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_SOUTH,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(thirdBorrowResponse.status).toBe(400);

      const returnResponse = await supertest(app)
        .post('/return')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId
        })

      expect(returnResponse.status).toBe(200);
    })

    it('A user cannot borrow a media item if the end date is before the start date', async () => {
      // Borrow media item with end date before start date
      const borrowResponse = await supertest(app)
        .post('/borrow')
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
        .post('/borrow')
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
        .post('/borrow')
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
        .post('/borrow')
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
        .post('/borrow')
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
        .post('/return')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId
        })

      expect(returnResponse.status).toBe(200);

      const returnResponse2 = await supertest(app)
        .post('/return')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId2
        })

      expect(returnResponse2.status).toBe(200);
    })

    it('A media item cannot be borrowed for longer than a branch\'s maximum borrowing duration as specified in the media borrowing config', async () => {
      const borrowResponse14DaysMaxBranch = await supertest(app)
        .post('/borrow')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 15).toISOString()
        })

      expect(borrowResponse14DaysMaxBranch.status).toBe(400);

      const borrowResponse7DaysMaxBranch = await supertest(app)
        .post('/borrow')
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
        .post('/renew')
        .send({
          mediaBorrowingRecordId: 999999,
          renewedEndDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 14).toISOString()
        })

      expect(renewResponse.status).toBe(400);
    })

    it('A media borrowing record cannot be renewed more times than the renewal limit specified in the given branch\'s media borrowing config', async () => {
      const borrowResponseMaxOneRenewal = await supertest(app)
        .post('/borrow')
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
        .post('/renew')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId,
          renewedEndDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 14).toISOString()
        })

      expect(renewResponseMaxOneAllowedSuccess.status).toBe(200);

      const renewResponseMaxOneAllowedFailure = await supertest(app)
        .post('/renew')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId,
          renewedEndDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 28).toISOString()
        })

      expect(renewResponseMaxOneAllowedFailure.status).toBe(400);

      const returnResponseMaxOneRenewal = await supertest(app)
        .post('/return')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId
        })

      expect(returnResponseMaxOneRenewal.status).toBe(200);

      const borrowResponseMaxTwoRenewals = await supertest(app)
        .post('/borrow')
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
        .post('/renew')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId2,
          renewedEndDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 14).toISOString()
        })

      expect(renewResponseMaxTwoAllowedSuccess.status).toBe(200);

      const renewResponseMaxTwoAllowedSuccess2 = await supertest(app)
        .post('/renew')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId2,
          renewedEndDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 21).toISOString()
        })

      expect(renewResponseMaxTwoAllowedSuccess2.status).toBe(200);

      const renewResponseMaxTwoAllowedFailure = await supertest(app)
        .post('/renew')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId2,
          renewedEndDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 28).toISOString()
        })

      expect(renewResponseMaxTwoAllowedFailure.status).toBe(400);

      const returnResponseMaxTwoRenewals = await supertest(app)
        .post('/return')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId2
        })

      expect(returnResponseMaxTwoRenewals.status).toBe(200);
    })

    it('A media item cannot be renewed if the renewed end date is before the previous end date', async () => {
      const borrowResponse = await supertest(app)
        .post('/borrow')
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
        .post('/renew')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId,
          renewedEndDate: new Date(baseDate.setUTCHours(14, 0, 0, 0) - 1000 * 60 * 60 * 7).toISOString()
        })

      expect(renewResponse.status).toBe(400);

      const returnResponse = await supertest(app)
        .post('/return')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId
        })

      expect(returnResponse.status).toBe(200);
    })

    it('A media item cannot be renewed if the renewed end date is outside the branch\'s opening hours', async () => {
      const borrowResponse = await supertest(app)
        .post('/borrow')
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
        .post('/renew')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId,
          renewedEndDate: new Date(baseDate.setUTCHours(4, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })

      expect(renewResponse.status).toBe(400);

      const returnResponse = await supertest(app)
        .post('/return')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId
        })

      expect(returnResponse.status).toBe(200);
    })

    it('A media item cannot be renewed if the renewed borrowing duration is longer than the branch\'s maximum borrowing duration', async () => {
      const borrowResponse = await supertest(app)
        .post('/borrow')
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
        .post('/renew')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId,
          renewedEndDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 22).toISOString()
        })

      expect(renewResponse.status).toBe(400);

      const returnResponse = await supertest(app)
        .post('/return')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId
        })

      expect(returnResponse.status).toBe(200);
    })

    it('A user can request a list of their borrowed media items', async () => {
      // Borrow two media items
      const borrowResponse1 = await supertest(app)
        .post('/borrow')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.INCEPTION,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })
  
      expect(borrowResponse1.status).toBe(200);
      const mediaBorrowingRecordId1 = DATABASE.MEDIA_BORROWING_ID();
  
      const borrowResponse2 = await supertest(app)
        .post('/borrow')
        .send({
          userId: DATABASE.USERS.SHEFFIELD_USER_1,
          mediaId: DATABASE.MEDIA.GATSBY,
          branchId: DATABASE.BRANCHES.SHEFFIELD_CENTRAL,
          startDate: new Date(baseDate.setUTCHours(15, 10, 0,0)).toISOString(),
          endDate: new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString()
        })
  
      expect(borrowResponse2.status).toBe(200);
      const mediaBorrowingRecordId2 = DATABASE.MEDIA_BORROWING_ID();
  
      const getBorrowedMediaItemsResponse = await supertest(app)
        .get(`/user/${DATABASE.USERS.SHEFFIELD_USER_1}/records`)
        .query({
          limit: 10,
          offset: 0
        })
  
      expect(getBorrowedMediaItemsResponse.status).toBe(200);
      expect(getBorrowedMediaItemsResponse.body.length).toBe(2);
      expect(getBorrowedMediaItemsResponse.body[0].mediaBorrowingRecordId).toBe(mediaBorrowingRecordId2);
      expect(getBorrowedMediaItemsResponse.body[1].mediaBorrowingRecordId).toBe(mediaBorrowingRecordId1);

      const mediaBorrowingRecord = getBorrowedMediaItemsResponse.body[1];

      expect(mediaBorrowingRecord.mediaId).toBe(DATABASE.MEDIA.INCEPTION);
      expect(mediaBorrowingRecord.startDate).toBe(new Date(baseDate.setUTCHours(15, 0, 0, 0)).toISOString());
      expect(mediaBorrowingRecord.endDate).toBe(new Date(baseDate.setUTCHours(15, 0, 0, 0) + 1000 * 60 * 60 * 24 * 7).toISOString());
      expect(mediaBorrowingRecord.renewals).toBe(0);
      expect(mediaBorrowingRecord.branch.branchId).toBe(DATABASE.BRANCHES.SHEFFIELD_CENTRAL);
      expect(mediaBorrowingRecord.branch.name).toBe('Sheffield Central Library');
      expect(mediaBorrowingRecord.branch.locationId).toBe(DATABASE.LOCATIONS.SHEFFIELD);
      expect(mediaBorrowingRecord.branch.borrowingConfig.maxRenewals).toBe(1);
      expect(mediaBorrowingRecord.branch.borrowingConfig.maxBorrowingPeriod).toBe(14);

      for (let day of mediaBorrowingRecord.branch.openingHours) {
        expect(day.length).toBe(2);
        const openingHours = day[1];
        const openingHoursLate = openingHours[0];
        const openingHoursEarly = openingHours[1];
        expect(openingHoursEarly.length).toBe(2);
        expect(openingHoursEarly[0]).toBe(0);
        expect(openingHoursEarly[1]).toBe(200);
        expect(openingHoursLate.length).toBe(2);
        expect(openingHoursLate[0]).toBe(900);
        expect(openingHoursLate[1]).toBe(1700);
      }
  
      const returnResponse1 = await supertest(app)
        .post('/return')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId1
        })
  
      expect(returnResponse1.status).toBe(200);
  
      const returnResponse2 = await supertest(app)
        .post('/return')
        .send({
          mediaBorrowingRecordId: mediaBorrowingRecordId2
        })
  
      expect(returnResponse2.status).toBe(200);
    })

    it('A user can request a list of branches for a given location', async () => {
      const getBranchesResponse = await supertest(app).get(`/location/${DATABASE.LOCATIONS.SHEFFIELD}/branches`)

      expect(getBranchesResponse.status).toBe(200);
      expect(getBranchesResponse.body.data.length).toBe(2);
      expect(getBranchesResponse.body.data[0].branchId).toBe(DATABASE.BRANCHES.SHEFFIELD_CENTRAL);
      expect(getBranchesResponse.body.data[1].branchId).toBe(DATABASE.BRANCHES.SHEFFIELD_SOUTH);
      expect(getBranchesResponse.body.data[0].locationId).toBe(DATABASE.LOCATIONS.SHEFFIELD);
      expect(getBranchesResponse.body.data[1].locationId).toBe(DATABASE.LOCATIONS.SHEFFIELD);
      expect(getBranchesResponse.body.data[0].name).toBe('Sheffield Central Library');
      expect(getBranchesResponse.body.data[1].name).toBe('Sheffield South Library');
      expect(getBranchesResponse.body.data[0].borrowingConfig.maxRenewals).toBe(1);
      expect(getBranchesResponse.body.data[0].borrowingConfig.maxBorrowingPeriod).toBe(14);
      expect(getBranchesResponse.body.data[1].borrowingConfig.maxRenewals).toBe(2);
      expect(getBranchesResponse.body.data[1].borrowingConfig.maxBorrowingPeriod).toBe(7);

      const centralOpeningHours = getBranchesResponse.body.data[0].openingHours;
      const southOpeningHours = getBranchesResponse.body.data[1].openingHours;

      for (let day of centralOpeningHours) {
        expect(day.length).toBe(2);
        const openingHours = day[1];
        const openingHoursLate = openingHours[0];
        const openingHoursEarly = openingHours[1];
        expect(openingHoursEarly.length).toBe(2);
        expect(openingHoursEarly[0]).toBe(0);
        expect(openingHoursEarly[1]).toBe(200);
        expect(openingHoursLate.length).toBe(2);
        expect(openingHoursLate[0]).toBe(900);
        expect(openingHoursLate[1]).toBe(1700);
      }

      for (let day of southOpeningHours) {
        expect(day.length).toBe(2);
        const openingHours = day[1][0];
        expect(openingHours.length).toBe(2);
        expect(openingHours[0]).toBe(900);
        expect(openingHours[1]).toBe(1700);
      }
    })
  })
});
 