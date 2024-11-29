import 'reflect-metadata'
import { MediaBorrowingRecord } from "../../interfaces/dto"
import { IMediaBorrowingDateValidator } from "../../interfaces/logic/date-validator/IMediaBorrowingDateValidator"
import { IBranchRepository } from "../../interfaces/data/repositories"
import { MediaBorrowingDateValidator } from "./MediaBorrowingDateValidator"
import { InvalidBorrowingDateError } from "../errors"
import { IDbContext } from "../../interfaces/data/uow"
import { BranchOpeningHours } from "../../interfaces/dto/BranchOpeningHours"
import { Message } from "../../interfaces/messaging/Message"

jest.mock("../../interfaces/data/repositories")
jest.mock("../../interfaces/data/uow")

let genericMediaBorrowingRecord : MediaBorrowingRecord
let genericBranchOpeningHours : BranchOpeningHours
let mockBranchRepository : jest.Mocked<IBranchRepository>
let mockDbContext : jest.Mocked<IDbContext>
let mediaBorrowingDateValidator : IMediaBorrowingDateValidator


beforeEach(() => {
    // Setup data.
    genericMediaBorrowingRecord = {
        mediaBorrowingRecordId : 0,
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

    genericBranchOpeningHours = [[900,1700],[900,1700],[900,1700],[900,1700],[900,1700],[900,1700],[900,1700]]

    // Setup repositories
    mockBranchRepository = new IBranchRepository as jest.Mocked<IBranchRepository>
    mockBranchRepository.getOpeningHoursById.mockResolvedValue(new Message(genericBranchOpeningHours))

    // Setup db context
    mockDbContext = new IDbContext as jest.Mocked<IDbContext>
    mockDbContext.getBranchRepository.mockResolvedValue(mockBranchRepository)

    // Setup media borrowing date validation logic
    mediaBorrowingDateValidator = new MediaBorrowingDateValidator(mockDbContext)
})

function getBorrowingDateValidationRequest() {
    return {
        startDate : genericMediaBorrowingRecord.startDate,
        endDate : genericMediaBorrowingRecord.endDate,
        branchId : genericMediaBorrowingRecord.branchId
    }
}

describe("A borrowing/renewal request is rejected if...", () => {
    test("the start date has been set to a date later than the end date.", async () => {
        genericMediaBorrowingRecord.startDate = new Date(genericMediaBorrowingRecord.endDate)
        genericMediaBorrowingRecord.startDate.setDate(genericMediaBorrowingRecord.startDate.getDate() + 1)

        const result = await mediaBorrowingDateValidator.validateBorrowingDates(getBorrowingDateValidationRequest())

        expect(result.errors[0]).toBeInstanceOf(InvalidBorrowingDateError)
        expect(result.value).toBe(false)
    })

    test("the end date is less than one day after the start date.", async () => {
        genericMediaBorrowingRecord.endDate = new Date(genericMediaBorrowingRecord.startDate)
        genericMediaBorrowingRecord.endDate.setHours(genericMediaBorrowingRecord.endDate.getHours() + 1)

        const {startDate, endDate, branchId} = genericMediaBorrowingRecord
        const result = await mediaBorrowingDateValidator.validateBorrowingDates(getBorrowingDateValidationRequest())

        expect(result.errors[0]).toBeInstanceOf(InvalidBorrowingDateError)
        expect(result.value).toBe(false)
    })

    test("the start date falls outside of normal business hours", async () => {
        genericMediaBorrowingRecord.startDate.setHours(8)
        genericMediaBorrowingRecord.startDate.setMinutes(59)

        const startDateTooEarlyResult = await mediaBorrowingDateValidator.validateBorrowingDates(getBorrowingDateValidationRequest())

        genericMediaBorrowingRecord.startDate.setHours(17)
        genericMediaBorrowingRecord.startDate.setMinutes(1)

        const startDateTooLateResult = await mediaBorrowingDateValidator.validateBorrowingDates(getBorrowingDateValidationRequest())

        expect(startDateTooEarlyResult.errors[0]).toBeInstanceOf(InvalidBorrowingDateError)
        expect(startDateTooEarlyResult.value).toBe(false)
    })

    test("the end date falls outside of normal business hours", async () => {
        genericMediaBorrowingRecord.endDate.setHours(8)
        genericMediaBorrowingRecord.endDate.setMinutes(59)

        const endDateTooEarlyResult = await mediaBorrowingDateValidator.validateBorrowingDates(getBorrowingDateValidationRequest())

        genericMediaBorrowingRecord.endDate.setHours(17)
        genericMediaBorrowingRecord.endDate.setMinutes(1)
        const endDateTooLateResult = await mediaBorrowingDateValidator.validateBorrowingDates(getBorrowingDateValidationRequest())

        expect(endDateTooEarlyResult.errors[0]).toBeInstanceOf(InvalidBorrowingDateError)
        expect(endDateTooLateResult.errors[0]).toBeInstanceOf(InvalidBorrowingDateError)
        expect(endDateTooEarlyResult.value).toBe(false)
        expect(endDateTooLateResult.value).toBe(false)
    })
})