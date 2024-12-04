import 'reflect-metadata'
import { MediaBorrowingRecord } from '../../../data/models'
import { IMediaBorrowingDateValidator } from '../../../interfaces/logic/mediaBorrowingDateValidation/IMediaBorrowingDateValidator'
import { IBranchRepository } from '../../../../amlBranches/interfaces/data/repositories'
import { InvalidBorrowingDateError, MediaBorrowingDateValidator } from ".."
import { IDbContext, IDbContextFactory } from '../../../../db/interfaces/dbContext'
import { BranchOpeningHours } from "../../../../amlBranches/data/models/BranchOpeningHours"
import { IMediaBorrowingConfigRepository } from '../../../interfaces/data/repositories'
import { MaxBorrowingPeriodExceededError } from '../../mediaBorrowingConfig'

jest.mock('../../../../amlBranches/interfaces/data/repositories')
jest.mock('../../../interfaces/data/repositories')
jest.mock('../../../../db/interfaces/dbContext')

let genericMediaBorrowingRecord : MediaBorrowingRecord
let genericBranchOpeningHours : BranchOpeningHours
let mockBranchRepository : jest.Mocked<IBranchRepository>
let mockMediaBorrowingConfigRepository : jest.Mocked<IMediaBorrowingConfigRepository>
let mockDbContext : jest.Mocked<IDbContext>
let mockDbContextFactory : jest.Mocked<IDbContextFactory>   
let mediaBorrowingDateValidator : IMediaBorrowingDateValidator
let genericBranchOpeningHoursMap : Map<number, [number, number][]>


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

    genericBranchOpeningHoursMap = new Map<number, [number, number][]>()
    genericBranchOpeningHoursMap.set(0, [[900,1700]])
    genericBranchOpeningHoursMap.set(1, [[900,1700]])
    genericBranchOpeningHoursMap.set(2, [[900,1700]])
    genericBranchOpeningHoursMap.set(3, [[900,1700]])
    genericBranchOpeningHoursMap.set(4, [[900,1700]])
    genericBranchOpeningHoursMap.set(5, [[900,1700]])
    genericBranchOpeningHoursMap.set(6, [[900,1700]])

    genericBranchOpeningHours = new BranchOpeningHours(genericBranchOpeningHoursMap)

    // Setup repositories
    mockBranchRepository = new IBranchRepository as jest.Mocked<IBranchRepository>
    mockBranchRepository.getOpeningHoursById.mockResolvedValue(genericBranchOpeningHours)

    mockMediaBorrowingConfigRepository = new IMediaBorrowingConfigRepository as jest.Mocked<IMediaBorrowingConfigRepository>
    mockMediaBorrowingConfigRepository.getRenewalLimit.mockResolvedValue(2)
    mockMediaBorrowingConfigRepository.getMaximumBorrowingDurationInDays.mockResolvedValue(14)

    // Setup db context
    mockDbContext = new IDbContext as jest.Mocked<IDbContext>
    mockDbContext.getBranchRepository.mockResolvedValue(mockBranchRepository)
    mockDbContext.getMediaBorrowingConfigRepository.mockResolvedValue(mockMediaBorrowingConfigRepository)

    // Setup db context factory
    mockDbContextFactory = new IDbContextFactory as jest.Mocked<IDbContextFactory>
    mockDbContextFactory.create.mockResolvedValue(mockDbContext)

    // Setup media borrowing date validation logic
    mediaBorrowingDateValidator = new MediaBorrowingDateValidator(mockDbContextFactory)
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
        mockMediaBorrowingConfigRepository.getMaximumBorrowingDurationInDays.mockResolvedValue(10)

        const result = await mediaBorrowingDateValidator.validateBorrowingDates(getBorrowingDateValidationRequest())

        expect(result.errors[0]).toBeInstanceOf(MaxBorrowingPeriodExceededError)
        expect(result.value).toBe(false)
    })
})

describe("A media borrowing date range is valid if...", () => {
    test("the start date and end date are within the branch's opening hours.", async () => {
        const result = await mediaBorrowingDateValidator.validateBorrowingDates(getBorrowingDateValidationRequest())
        expect(result.value).toBe(true)
    })

    test("the start date & end date are within at least one of the branch's opening periods for the given dates.", async () => {
        genericBranchOpeningHoursMap.get(genericMediaBorrowingRecord.startDate.getDay())?.push([200, 400])
        genericBranchOpeningHoursMap.get(genericMediaBorrowingRecord.endDate.getDay())?.push([100, 400])
        genericMediaBorrowingRecord.startDate.setHours(2)
        genericMediaBorrowingRecord.endDate.setHours(1)

        const morningResult = await mediaBorrowingDateValidator.validateBorrowingDates(getBorrowingDateValidationRequest())
        expect(morningResult.value).toBe(true)

        genericMediaBorrowingRecord.startDate.setHours(14)
        genericMediaBorrowingRecord.endDate.setHours(13)
        const afternoonResult = await mediaBorrowingDateValidator.validateBorrowingDates(getBorrowingDateValidationRequest())
        expect(afternoonResult.value).toBe(true)
    })
})