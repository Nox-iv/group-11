import { addMediaBorrowingRecord } from "./mediaBorrowingLogic";
import { MediaBorrowingRecord } from "./mediaBorrowingRecord";

describe('Add media borrowing record', () => {
    test('User with ID 1 borrows media item with ID 10 with a due date two weeks from the current date.', () => {
        const startDate = new Date()
        const endDate = new Date(startDate)

        endDate.setDate(endDate.getDate() + 14)

        const actualResult = addMediaBorrowingRecord(1, 10, startDate, endDate)

        expect(actualResult.userId).toBe(1)
        expect(actualResult.mediaItemId).toBe(10)
        expect(actualResult.startDate.getTime()).toBe(startDate.getTime())
        expect(actualResult.endDate.getTime()).toBe(endDate.getTime())
        expect(actualResult.renewals).toBe(0)
    });
});