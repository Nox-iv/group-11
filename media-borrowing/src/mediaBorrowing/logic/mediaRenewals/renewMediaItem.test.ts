import 'reflect-metadata'
import { IMediaBorrowingConfigRepository, IMediaBorrowingRepository } from '../../interfaces/data/repositories';
import { IDbContext } from '../../../db/interfaces/dbContext';
import { IMediaRenewalLogic } from '../../interfaces/logic/mediaRenewals/IMediaRenewalLogic';
import { MediaBorrowingRecord } from '../../data/models';
import { Message } from '../../../shared/messaging/Message';
import { MediaRenewalLogic } from './mediaRenewalLogic';
import { InvalidBorrowingRecordError } from '../mediaBorrowing';
import { InvalidBorrowingDateError } from '../mediaBorrowingDateValidation';
import { MaxRenewalsExceededError } from '../mediaBorrowingConfig';
import { MediaRenewalRequest } from './dto/MediaRenewalRequest';
import { IMediaBorrowingDateValidator } from '../../interfaces/logic/mediaBorrowingDateValidation/IMediaBorrowingDateValidator';

jest.mock('../../interfaces/data/repositories')
jest.mock('../../../db/interfaces/dbContext')
jest.mock('../../interfaces/logic/mediaBorrowingDateValidation/IMediaBorrowingDateValidator')

let mockMediaBorrowingRepository : jest.Mocked<IMediaBorrowingRepository>;
let mockMediaBorrowingConfigRepository : jest.Mocked<IMediaBorrowingConfigRepository>
let mockDbContext : jest.Mocked<IDbContext>
let mockMediaBorrowingDateValidator : jest.Mocked<IMediaBorrowingDateValidator>
let mediaRenewalLogic : IMediaRenewalLogic
let genericMediaBorrowingRecord : MediaBorrowingRecord
let genericMediaRenewalRequest : MediaRenewalRequest

beforeEach(() => {
    // Setup data.
    genericMediaBorrowingRecord = {
        mediaBorrowingRecordId : 1,
        userId: 1,
        branchId: 1,
        mediaId: 1,
        startDate: new Date(),
        endDate: new Date(),
        renewals: 0
    }

    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 14)

    genericMediaBorrowingRecord.endDate = endDate

    genericMediaRenewalRequest = {
        mediaBorrowingRecordId : 1,
        renewedEndDate : new Date(genericMediaBorrowingRecord.endDate)
    }

    genericMediaRenewalRequest.renewedEndDate.setDate(genericMediaRenewalRequest.renewedEndDate.getDate() + 14)

    // Setup mock repositories.
    mockMediaBorrowingRepository = new IMediaBorrowingRepository() as jest.Mocked<IMediaBorrowingRepository>
    mockMediaBorrowingRepository.checkBorrowingRecordExists.mockResolvedValue(new Message(true))
    mockMediaBorrowingRepository.getBorrowingRecordById.mockResolvedValue(new Message(genericMediaBorrowingRecord))

    mockMediaBorrowingConfigRepository = new IMediaBorrowingConfigRepository as jest.Mocked<IMediaBorrowingConfigRepository>
    mockMediaBorrowingConfigRepository.getRenewalLimit.mockResolvedValue(new Message(5))

    // Setup mock DB context.
    mockDbContext = new IDbContext() as jest.Mocked<IDbContext>;
    mockDbContext.getMediaBorrowingRepository.mockResolvedValue(mockMediaBorrowingRepository)
    mockDbContext.getMediaBorrowingConfigRepository.mockResolvedValue(mockMediaBorrowingConfigRepository)

    // Setup logic.
    mockMediaBorrowingDateValidator = new IMediaBorrowingDateValidator() as jest.Mocked<IMediaBorrowingDateValidator>
    mockMediaBorrowingDateValidator.validateBorrowingDates.mockResolvedValue(new Message(true))

    mediaRenewalLogic = new MediaRenewalLogic(mockDbContext, mockMediaBorrowingDateValidator)
})

describe("A user cannot renew a borrowed media item if...", () => {
    test("they are not actively borrowing the media item.", async () => {
        mockMediaBorrowingRepository.getBorrowingRecordById.mockResolvedValue(new Message())

        const result = await mediaRenewalLogic.renewMediaItem(genericMediaRenewalRequest)

        expect(result.errors[0]).toBeInstanceOf(InvalidBorrowingRecordError)
        expect(result.value).toBe(false)
    })

    test("they have reached the renewal limit.", async () => {
        genericMediaBorrowingRecord.renewals = 1
        mockMediaBorrowingConfigRepository.getRenewalLimit.mockResolvedValue(new Message(1))

        const result = await mediaRenewalLogic.renewMediaItem(genericMediaRenewalRequest)

        expect(result.errors[0]).toBeInstanceOf(MaxRenewalsExceededError)
        expect(result.value).toBe(false)
    })

    test("the renewed end date is invalid.", async () => {
        mockMediaBorrowingDateValidator.validateBorrowingDates.mockResolvedValue(new Message(false, [new InvalidBorrowingDateError()]))

        const result = await mediaRenewalLogic.renewMediaItem(genericMediaRenewalRequest)

        expect(result.errors[0]).toBeInstanceOf(InvalidBorrowingDateError)
        expect(result.value).toBe(false)
    })
})

describe("When a media borrowing record is renewed...", () => {
    test("the media borrowing record's renewal count and end date are updated.", async () => {
        const expectedRenewals = genericMediaBorrowingRecord.renewals + 1
        const expectedEndDate = genericMediaRenewalRequest.renewedEndDate

        const result = await mediaRenewalLogic.renewMediaItem(genericMediaRenewalRequest)

        expect(result.value).toBe(true)
        expect(genericMediaBorrowingRecord.renewals).toBe(expectedRenewals)
        expect(genericMediaBorrowingRecord.endDate).toBe(expectedEndDate)
    })

    test("the media borrowing record is updated in the database", async () => {
        const result = await mediaRenewalLogic.renewMediaItem(genericMediaRenewalRequest)

        expect(result.value).toBe(true)
        expect(mockMediaBorrowingRepository.updateBorrowingRecord).toHaveBeenCalledWith(genericMediaBorrowingRecord)
    })
})