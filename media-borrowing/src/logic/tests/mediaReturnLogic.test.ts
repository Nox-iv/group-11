import 'reflect-metadata';
import Container from "typedi";
import { MediaBorrowingRecord } from '../types/mediaBorrowingRecord';
import { UserRepository } from '../../data/user';
import { MediaBorrowingRepository } from '../../data/borrowing';
import { FakeUserRepository } from '../../mocks';
import { FakeMediaBorrowingRepository } from '../../mocks';
import { MediaReturnLogic } from '../mediaReturnLogic';

const existingMediaBorrowingRecord : MediaBorrowingRecord = {
    userId: 1,
    mediaId: 1,
    startDate: new Date(),
    endDate: new Date(),
    renewals: 0
}

existingMediaBorrowingRecord.endDate.setDate(existingMediaBorrowingRecord.endDate.getDate() + 14)

const invalidMediaId = 4
const fakeUserRepository = new FakeUserRepository()
const fakeMediaBorrowingRepository = new FakeMediaBorrowingRepository()

Container.set(UserRepository, fakeUserRepository)
Container.set(MediaBorrowingRepository, fakeMediaBorrowingRepository)

const mediaReturnLogic = Container.get(MediaReturnLogic)

beforeEach(() => {
    fakeMediaBorrowingRepository.mediaBorrowingRecords = [existingMediaBorrowingRecord]
    fakeMediaBorrowingRepository.mediaItems = new Map<number, number>()
    fakeMediaBorrowingRepository.mediaItems.set(1, 1)
    fakeMediaBorrowingRepository.mediaItems.set(2, 1)
    fakeMediaBorrowingRepository.mediaItems.set(3, 1)
}) 

describe("Media returns", () => {
    test("A user can return a media item that they have borrowed", () => {
        const userId = existingMediaBorrowingRecord.userId
        const mediaId = existingMediaBorrowingRecord.mediaId

        mediaReturnLogic.returnMediaItem(existingMediaBorrowingRecord)

        expect(fakeMediaBorrowingRepository.mediaBorrowingRecords.length).toBe(0)
        expect(fakeMediaBorrowingRepository.mediaItems.get(1)).toBe(2)
    })
})

