import 'reflect-metadata'
import { MediaBorrowingRecord } from '../../data/models'
import { IMediaBorrowingDateValidator } from '../../interfaces/logic/mediaBorrowingDateValidation/IMediaBorrowingDateValidator'
import { IBranchRepository } from '../../../amlBranches/interfaces/data/repositories'
import { InvalidBorrowingDateError, MediaBorrowingDateValidator } from "."
import { IDbContext } from '../../../db/interfaces/dbContext'
import { BranchOpeningHours } from "../../data/models/BranchOpeningHours"
import { Message } from "../../../shared/messaging/Message"
import { IMediaBorrowingConfigRepository } from '../../interfaces/data/repositories'
import { MaxBorrowingPeriodExceededError } from '../mediaBorrowingConfig'

jest.mock('../../../amlBranches/interfaces/data/repositories')
jest.mock('../../interfaces/data/repositories')
jest.mock('../../../db/interfaces/dbContext')

let genericMediaBorrowingRecord : MediaBorrowingRecord
let genericBranchOpeningHours : BranchOpeningHours
let mockBranchRepository : jest.Mocked<IBranchRepository>
let mockMediaBorrowingConfigRepository : jest.Mocked<IMediaBorrowingConfigRepository>
let mockDbContext : jest.Mocked<IDbContext>
let mediaBorrowingDateValidator : IMediaBorrowingDateValidator


beforeEach(() => {
    // Setup data.
    genericMediaBorrowingRecord = {
        mediaBorrowingRecordId : 0,
        userId: 1,
        mediaId: 1,
        branchId: 1,
        startDate: new Date('2024-11-30T16:00:00.000Z'),
        endDate: new Date(),
        renewals: 0
    }

    genericMediaBorrowingRecord.endDate = new Date(genericMediaBorrowingRecord.startDate)
    genericMediaBorrowingRecord.endDate.setDate(genericMediaBorrowingRecord.startDate.getDate() + 14)

    genericBranchOpeningHours = [[900,1700],[900,1700],[900,1700],[900,1700],[900,1700],[900,1700],[900,1700]]

    // Setup repositories
    mockBranchRepository = new IBranchRepository as jest.Mocked<IBranchRepository>
    mockBranchRepository.getOpeningHoursById.mockResolvedValue(new Message(genericBranchOpeningHours))

    mockMediaBorrowingConfigRepository = new IMediaBorrowingConfigRepository as jest.Mocked<IMediaBorrowingConfigRepository>
    mockMediaBorrowingConfigRepository.getRenewalLimit.mockResolvedValue(new Message(2))
    mockMediaBorrowingConfigRepository.getMaximumBorrowingDurationInDays.mockResolvedValue(new Message(14))

    // Setup db context
    mockDbContext = new IDbContext as jest.Mocked<IDbContext>
    mockDbContext.getBranchRepository.mockResolvedValue(mockBranchRepository)
    mockDbContext.getMediaBorrowingConfigRepository.mockResolvedValue(mockMediaBorrowingConfigRepository)

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

    test("the requested borrowing duration exceeds the maximum borrowing duration", async () => {
        mockMediaBorrowingConfigRepository.getMaximumBorrowingDurationInDays.mockResolvedValue(new Message(10))

        const result = await mediaBorrowingDateValidator.validateBorrowingDates(getBorrowingDateValidationRequest())

        expect(result.errors[0]).toBeInstanceOf(MaxBorrowingPeriodExceededError)
        expect(result.value).toBe(false)
    })
})

describe("When a borrowing date range is valid..", () => {
    test("the validation method returns true.", async() => {
        const result = await mediaBorrowingDateValidator.validateBorrowingDates(getBorrowingDateValidationRequest())
        expect(result.value).toBe(true)
        expect(result.hasErrors()).toBe(false)
    })
})