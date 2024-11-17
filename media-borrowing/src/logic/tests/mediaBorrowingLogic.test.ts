import 'reflect-metadata';
import Container from "typedi";
import { MediaBorrowingRecord, MediaBorrowingLogic, InvalidBorrowingDateError, InvalidUserError, MaxBorrowingPeriodExceededError, MaxRenewalsExceededError } from "..";
import { UserRepository, MediaBorrowingRepository } from '../../data';
import { FakeUserRepository, FakeMediaBorrowingRepository } from '../../mocks';
import { MAX_BORROWING_PERIOD_DAYS, MAX_RENEWALS } from '../../config';

const genericMediaBorrowingRecord : MediaBorrowingRecord = {
    userId: 1,
    mediaId: 1,
    startDate: new Date(),
    endDate: new Date(),
    renewals: 0
}

const invalidMediaId = 4
const fakeUserRepository = new FakeUserRepository()
const fakeMediaBorrowingRepository = new FakeMediaBorrowingRepository()

Container.set(UserRepository, fakeUserRepository)
Container.set(MediaBorrowingRepository, fakeMediaBorrowingRepository)

const mediaBorrowingLogic = Container.get(MediaBorrowingLogic)

beforeEach(() => {
    fakeUserRepository.setValidUser()
    fakeMediaBorrowingRepository.mediaItems = new Map()
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

    test('A non-existent user cannot borrow a media item.', () => {
        fakeUserRepository.setInvalidUser()
        expect(() => {mediaBorrowingLogic.borrowMediaItem(genericMediaBorrowingRecord)}).toThrow(InvalidUserError)
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