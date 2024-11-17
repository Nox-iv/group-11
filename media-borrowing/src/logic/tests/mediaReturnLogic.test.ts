import 'reflect-metadata';
import Container from "typedi";
import { MediaReturnLogic, MediaBorrowingRecord } from '..';
import { MediaBorrowingRepository } from '../../data';
import { FakeMediaBorrowingRepository } from '../../mocks';

const existingMediaBorrowingRecord : MediaBorrowingRecord = {
    userId: 1,
    mediaId: 1,
    startDate: new Date(),
    endDate: new Date(),
    renewals: 0
}

existingMediaBorrowingRecord.endDate.setDate(existingMediaBorrowingRecord.endDate.getDate() + 14)

const fakeMediaBorrowingRepository = new FakeMediaBorrowingRepository()

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

