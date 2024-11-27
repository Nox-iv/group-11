import 'reflect-metadata'
import { IMediaBorrowingConfigRepository, IMediaBorrowingRepository } from '../../interfaces/data/repositories';
import { IDbContext } from '../../interfaces/data/uow';
import { IMediaRenewalLogic } from '../../interfaces/logic/renewal/IMediaRenewalLogic';
import { MediaBorrowingRecord } from '../../interfaces/dto';
import { Message } from '../../interfaces/messaging/Message';
import { MediaRenewalLogic } from './mediaRenewalLogic';
import { InvalidBorrowingRecordError, MaxRenewalsExceededError } from '../errors';
import { MediaRenewalRequest } from '../../interfaces/dto/MediaRenewalRequest';

jest.mock("../../interfaces/data/uow")
jest.mock("../../interfaces/data/repositories")

let mockMediaBorrowingRepository : jest.Mocked<IMediaBorrowingRepository>;
let mockMediaBorrowingConfigRepository : jest.Mocked<IMediaBorrowingConfigRepository>
let mockDbContext : jest.Mocked<IDbContext>
let mediaRenewalLogic : IMediaRenewalLogic
let genericMediaBorrowingRecord : MediaBorrowingRecord
let genericMediaRenewalRequest : MediaRenewalRequest

beforeEach(() => {
    // Setup data.
    genericMediaBorrowingRecord = {
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
        userId : 1,
        mediaId : 1,
        renewedEndDate : new Date(genericMediaBorrowingRecord.endDate)
    }

    genericMediaRenewalRequest.renewedEndDate.setDate(genericMediaRenewalRequest.renewedEndDate.getDate() + 14)

    // Setup mock repositories.
    mockMediaBorrowingRepository = new IMediaBorrowingRepository() as jest.Mocked<IMediaBorrowingRepository>
    mockMediaBorrowingRepository.hasBorrowingRecord.mockResolvedValue(new Message(true))
    mockMediaBorrowingRepository.getBorrowingRecord.mockResolvedValue(new Message(genericMediaBorrowingRecord))

    mockMediaBorrowingConfigRepository = new IMediaBorrowingConfigRepository as jest.Mocked<IMediaBorrowingConfigRepository>
    mockMediaBorrowingConfigRepository.getRenewalLimit.mockResolvedValue(new Message(5))

    // Setup mock DB context.
    mockDbContext = new IDbContext() as jest.Mocked<IDbContext>;
    mockDbContext.getMediaBorrowingRepository.mockResolvedValue(mockMediaBorrowingRepository)
    mockDbContext.getMediaBorrowingConfigRepository.mockResolvedValue(mockMediaBorrowingConfigRepository)

    // Setup media renewal logic.
    mediaRenewalLogic = new MediaRenewalLogic(mockDbContext)
})

describe("A user cannot renew a borrowed media item if...", () => {
    test("they are not actively borrowing the media item.", async () => {
        mockMediaBorrowingRepository.getBorrowingRecord.mockResolvedValue(new Message())

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
})