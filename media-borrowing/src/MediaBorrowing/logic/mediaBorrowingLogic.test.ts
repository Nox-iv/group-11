import { MediaBorrowingLogic } from "./mediaBorrowingLogic";

const mediaBorrowingLogic = new MediaBorrowingLogic()

describe('Update media borrowing record', () => {
    test('User with ID 1 borrows media item with ID 10 with a due date two weeks from the current date.', () => {
        const startDate = new Date()
        const endDate = new Date(startDate)

        endDate.setDate(endDate.getDate() + 14)

        const result = mediaBorrowingLogic.addMediaBorrowingRecord(1, 10, startDate, endDate)

        expect(result.userId).toBe(1)
        expect(result.mediaItemId).toBe(10)
        expect(result.startDate.getTime()).toBe(startDate.getTime())
        expect(result.endDate.getTime()).toBe(endDate.getTime())
        expect(result.renewals).toBe(0)
    });

    test('Users cannot borrow a media item with an end date after the start date', () => {
        const startDate = new Date()
        const endDate = new Date(startDate)

        endDate.setDate(endDate.getDate() - 1)

        expect(() => {mediaBorrowingLogic.addMediaBorrowingRecord(1, 10, startDate, endDate)}).toThrow()
    })

    test('A borrowing record cannot be created for a non-existent user', () => {
        const startDate = new Date()
        const endDate = new Date(startDate)

        endDate.setDate(endDate.getDate() + 14)

        expect(() => {mediaBorrowingLogic.addMediaBorrowingRecord(3877387, 10, startDate, endDate)}).toThrow()
    })
});