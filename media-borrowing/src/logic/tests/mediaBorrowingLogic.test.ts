import 'reflect-metadata';
import Container from "typedi";
import { MediaBorrowingRepository } from '../../data';
import { FakeMediaBorrowingRepository } from '../../mocks';
import { MAX_BORROWING_PERIOD_DAYS, MAX_RENEWALS } from '../../config';
import { 
    MediaBorrowingRecord, 
    MediaBorrowingLogic, 
    InvalidBorrowingDateError, 
    MaxBorrowingPeriodExceededError, 
    MaxRenewalsExceededError, 
    InvalidBorrowingRecordError } from "..";

const genericMediaBorrowingRecord : MediaBorrowingRecord = {
    userId: 1,
    mediaId: 1,
    startDate: new Date(),
    endDate: new Date(),
    renewals: 0
}

const invalidMediaId = 4
const invalidUserId = 4
const fakeMediaBorrowingRepository = new FakeMediaBorrowingRepository()

Container.set(MediaBorrowingRepository, fakeMediaBorrowingRepository)

const mediaBorrowingLogic = Container.get(MediaBorrowingLogic)

beforeEach(() => {
    fakeMediaBorrowingRepository.mediaItems = new Map()
    fakeMediaBorrowingRepository.users = [1, 2, 3]
    fakeMediaBorrowingRepository.mediaBorrowingRecords = []
    
    fakeMediaBorrowingRepository.mediaItems.set(1, 1)
    fakeMediaBorrowingRepository.mediaItems.set(2, 1)
    fakeMediaBorrowingRepository.mediaItems.set(3, 1)

    const start = Date.now()
    genericMediaBorrowingRecord.userId = 1
    genericMediaBorrowingRecord.mediaId = 1
    genericMediaBorrowingRecord.startDate = new Date(start)
    genericMediaBorrowingRecord.endDate = new Date(start)
    genericMediaBorrowingRecord.endDate.setDate(genericMediaBorrowingRecord.endDate.getDate() + 14)
    genericMediaBorrowingRecord.renewals = 0

    Container.set(MAX_BORROWING_PERIOD_DAYS, 14)
    Container.set(MAX_RENEWALS, 2)
})

describe('Borrow Media Item', () => {
    test('A media item can be borrowed.', () => {
        const initialMediaAvailability = fakeMediaBorrowingRepository.mediaItems.get(genericMediaBorrowingRecord.mediaId)!
        mediaBorrowingLogic.borrowMediaItem(genericMediaBorrowingRecord)

        expect(fakeMediaBorrowingRepository.mediaItems.get(genericMediaBorrowingRecord.mediaId)).toBe(initialMediaAvailability - 1)
    });

    test('A user can borrow multiple media items', () => {
        const mediaItemId1 = genericMediaBorrowingRecord.mediaId
        const mediaItemId2 = 2

        const initialAvailabilityItem1 = fakeMediaBorrowingRepository.mediaItems.get(mediaItemId1)!
        const initialAvailabilityItem2 = fakeMediaBorrowingRepository.mediaItems.get(mediaItemId2)!

        mediaBorrowingLogic.borrowMediaItem(genericMediaBorrowingRecord)

        genericMediaBorrowingRecord.mediaId = mediaItemId2
        mediaBorrowingLogic.borrowMediaItem(genericMediaBorrowingRecord)

        expect(fakeMediaBorrowingRepository.mediaItems.get(mediaItemId1)).toBe(initialAvailabilityItem1 - 1)
        expect(fakeMediaBorrowingRepository.mediaItems.get(mediaItemId2)).toBe(initialAvailabilityItem2 - 1)
    })

    test('A media item cannot be borrowed with an end date that is earlier than the given start date.', () => {
        const invalidEndDate = new Date(genericMediaBorrowingRecord.startDate.getTime() - 1)
        genericMediaBorrowingRecord.endDate = invalidEndDate

        expect(() => {mediaBorrowingLogic.borrowMediaItem(genericMediaBorrowingRecord)}).toThrow(InvalidBorrowingDateError)
    })

    test('A new media borrowing record must not have any renewals', () => {
        genericMediaBorrowingRecord.renewals = 1
        expect(() => mediaBorrowingLogic.borrowMediaItem(genericMediaBorrowingRecord)).toThrow(InvalidBorrowingRecordError)
    })

    test('A non-existent user cannot borrow a media item.', () => {
        genericMediaBorrowingRecord.userId = invalidUserId
        expect(() => {mediaBorrowingLogic.borrowMediaItem(genericMediaBorrowingRecord)}).toThrow()
    })

    test('A non-existent media item cannot be borrowed.', () => {
        genericMediaBorrowingRecord.mediaId = invalidMediaId
        expect(() => {mediaBorrowingLogic.borrowMediaItem(genericMediaBorrowingRecord)}).toThrow()
    })

    test('An unavailable media item cannot be borrowed.', () => {
        genericMediaBorrowingRecord.mediaId = 3
        mediaBorrowingLogic.borrowMediaItem(genericMediaBorrowingRecord)

        const mediaBorrowingRecordForUnavailableItem: MediaBorrowingRecord = {
            userId: 2,
            mediaId: genericMediaBorrowingRecord.mediaId,
            startDate: genericMediaBorrowingRecord.startDate,
            endDate: genericMediaBorrowingRecord.endDate,
            renewals: 0
        }

        expect(() => {mediaBorrowingLogic.borrowMediaItem(mediaBorrowingRecordForUnavailableItem)}).toThrow()
    })

    test('Users cannot borrow several copies of the same media item.', () => {
        mediaBorrowingLogic.borrowMediaItem(genericMediaBorrowingRecord)
        expect(() => {mediaBorrowingLogic.borrowMediaItem(genericMediaBorrowingRecord)}).toThrow()
    })
});

describe("Renew borrowed media item", () => {
    test("A borrowed media item can be renewed.", () => {
        const userId = genericMediaBorrowingRecord.userId
        const mediaId = genericMediaBorrowingRecord.mediaId
        const extension = 14

        const endDateAfterRenewal = new Date(genericMediaBorrowingRecord.endDate)
        endDateAfterRenewal.setDate(endDateAfterRenewal.getDate() + extension)

        mediaBorrowingLogic.borrowMediaItem(genericMediaBorrowingRecord)
        mediaBorrowingLogic.renewBorrowedMediaItem(genericMediaBorrowingRecord, extension)

        expect(fakeMediaBorrowingRepository.mediaBorrowingRecords[0].endDate).toStrictEqual(endDateAfterRenewal)
    })

    test("A renewal cannot extend beyond the maximum borrowing period.", () => {
        const userId = genericMediaBorrowingRecord.userId
        const mediaId = genericMediaBorrowingRecord.mediaId
        const extension = 14

        const endDateAfterRenewal = new Date(genericMediaBorrowingRecord.endDate)
        endDateAfterRenewal.setDate(endDateAfterRenewal.getDate() + extension)

        Container.set(MAX_BORROWING_PERIOD_DAYS, 13)

        mediaBorrowingLogic.borrowMediaItem(genericMediaBorrowingRecord)
        expect(() => mediaBorrowingLogic.renewBorrowedMediaItem(genericMediaBorrowingRecord, extension)).toThrow(MaxBorrowingPeriodExceededError)
    })

    test("A renewal is rejected if the user has exceeded the max number of renewals.", () => {
        const userId = genericMediaBorrowingRecord.userId
        const mediaId = genericMediaBorrowingRecord.mediaId
        const extension = 14

        const endDateAfterRenewal = new Date(genericMediaBorrowingRecord.endDate)
        endDateAfterRenewal.setDate(endDateAfterRenewal.getDate() + extension)

        Container.set(MAX_RENEWALS, 1)

        mediaBorrowingLogic.borrowMediaItem(genericMediaBorrowingRecord)
        mediaBorrowingLogic.renewBorrowedMediaItem(fakeMediaBorrowingRepository.mediaBorrowingRecords[0], extension)
        expect(() => mediaBorrowingLogic.renewBorrowedMediaItem(fakeMediaBorrowingRepository.mediaBorrowingRecords[0], extension)).toThrow(MaxRenewalsExceededError)
    })
})

describe("Media returns", () => {
    test("A user can return a media item that they have borrowed", () => {
        const userId = genericMediaBorrowingRecord.userId
        const mediaId = genericMediaBorrowingRecord.mediaId

        mediaBorrowingLogic.borrowMediaItem(genericMediaBorrowingRecord)
        mediaBorrowingLogic.returnMediaItem(genericMediaBorrowingRecord)

        expect(fakeMediaBorrowingRepository.mediaBorrowingRecords.length).toBe(0)
        expect(fakeMediaBorrowingRepository.mediaItems.get(1)).toBe(1)
    })
})

describe("Retrieve media borrowing records", () => {
    test("All media borrowing records for a specific user can be retrieved", () => {
        const mediaBorrowingRecordOtherUser: MediaBorrowingRecord = {
            userId: 2,
            mediaId: 2,
            startDate: genericMediaBorrowingRecord.startDate,
            endDate: genericMediaBorrowingRecord.endDate,
            renewals: 0
        }

        mediaBorrowingLogic.borrowMediaItem(genericMediaBorrowingRecord)
        mediaBorrowingLogic.borrowMediaItem(mediaBorrowingRecordOtherUser)

        expect(mediaBorrowingLogic.getBorrowingRecordsByUserId(1)).toStrictEqual([genericMediaBorrowingRecord])
    })
})