import { MediaBorrowingRecord } from "../../interfaces/dto"
import { IMediaBorrowingDateValidator } from "../../interfaces/logic/date-validator/IMediaBorrowingDateValidator"
import { MediaBorrowingDateValidator } from "./MediaBorrowingDateValidator"
import { InvalidBorrowingDateError } from "../errors"

let genericMediaBorrowingRecord : MediaBorrowingRecord
let mediaBorrowingDateValidator : IMediaBorrowingDateValidator


beforeEach(() => {
    // Setup data.
    genericMediaBorrowingRecord = {
        userId: 1,
        mediaId: 1,
        branchId: 1,
        startDate: new Date(),
        endDate: new Date(),
        renewals: 0
    }

    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 14)

    genericMediaBorrowingRecord.endDate = endDate

    // Setup media borrowing date validation logic
    mediaBorrowingDateValidator = new MediaBorrowingDateValidator()
})

describe("A borrowing/renewal request is rejected if...", () => {
    test("the start date has been set to a date later than the end date.", async () => {
        genericMediaBorrowingRecord.startDate = new Date(genericMediaBorrowingRecord.endDate)
        genericMediaBorrowingRecord.startDate.setDate(genericMediaBorrowingRecord.startDate.getDate() + 1)

        const result = mediaBorrowingDateValidator.validateBorrowingDates(genericMediaBorrowingRecord.startDate, genericMediaBorrowingRecord.endDate)

        expect(result.errors[0]).toBeInstanceOf(InvalidBorrowingDateError)
        expect(result.value).toBe(false)
    })

    test("the end date is less than one day after the start date.", async () => {
        genericMediaBorrowingRecord.endDate = new Date(genericMediaBorrowingRecord.startDate)
        genericMediaBorrowingRecord.endDate.setHours(genericMediaBorrowingRecord.endDate.getHours() + 1)

        const result = mediaBorrowingDateValidator.validateBorrowingDates(genericMediaBorrowingRecord.startDate, genericMediaBorrowingRecord.endDate)

        expect(result.errors[0]).toBeInstanceOf(InvalidBorrowingDateError)
        expect(result.value).toBe(false)
    })
})