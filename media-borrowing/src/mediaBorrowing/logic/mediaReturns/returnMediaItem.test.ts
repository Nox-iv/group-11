import 'reflect-metadata'
import { IMediaBorrowingRepository } from '../../interfaces/data/repositories'
import { IDbContext, IDbContextFactory } from '../../../db/interfaces/dbContext'
import { IMediaReturnLogic } from '../../interfaces/logic/mediaReturns/IMediaReturnLogic'
import { InvalidBorrowingRecordError } from '../mediaBorrowing'
import { MediaReturnLogic } from './mediaReturnLogic'
import { Message } from '../../../shared/messaging/Message'
import { MediaBorrowingRecord } from '../../data/models'
import { MediaInventoryRecord } from '../../../mediaInventory/data/models'
import { IMediaInventoryLogic } from '../../../mediaInventory/interfaces/logic/IMediaInventoryLogic'

jest.mock('../../interfaces/data/repositories')
jest.mock('../../../mediaInventory/interfaces/logic/IMediaInventoryLogic')
jest.mock('../../../db/interfaces/dbContext')

let mockMediaBorrowingRepository : jest.Mocked<IMediaBorrowingRepository>
let mockDbContext : jest.Mocked<IDbContext>
let mockMediaInventoryLogic : jest.Mocked<IMediaInventoryLogic>
let mockDbContextFactory : jest.Mocked<IDbContextFactory>
let mediaReturnLogic : IMediaReturnLogic
let mediaBorrowingRecordId : number
let genericMediaBorrowingRecord : MediaBorrowingRecord
let genericMediaInventoryRecord : MediaInventoryRecord

beforeEach(() => {
    // Setup data
    mediaBorrowingRecordId = 1

    genericMediaBorrowingRecord = {
        mediaBorrowingRecordId : 1,
        userId : 1,
        mediaId : 1,
        branchId : 1,
        renewals : 0,
        startDate : new Date(),
        endDate : new Date()
    }

    genericMediaBorrowingRecord.endDate = genericMediaBorrowingRecord.startDate
    genericMediaBorrowingRecord.endDate.setDate(genericMediaBorrowingRecord.startDate.getDate() + 14)

    genericMediaInventoryRecord = {
        mediaInventoryId : 1,
        mediaId : 1,
        branchId : 1,
        availability : 1
    }

    // Setup mock repositories 
    mockMediaBorrowingRepository = new IMediaBorrowingRepository as jest.Mocked<IMediaBorrowingRepository>
    mockMediaBorrowingRepository.getMediaBorrowingRecordById.mockResolvedValue(genericMediaBorrowingRecord)
    mockMediaBorrowingRepository.archiveMediaBorrowingRecord.mockResolvedValue()

    // Setup db context
    mockDbContext = new IDbContext as jest.Mocked<IDbContext>
    mockDbContext.getMediaBorrowingRepository.mockResolvedValue(mockMediaBorrowingRepository)

    // Setup db context factory
    mockDbContextFactory = new IDbContextFactory as jest.Mocked<IDbContextFactory>
    mockDbContextFactory.create.mockResolvedValue(mockDbContext)

    // Setup logic
    mockMediaInventoryLogic = new IMediaInventoryLogic as jest.Mocked<IMediaInventoryLogic>
    mockMediaInventoryLogic.incrementMediaItemAvailabilityAtBranch.mockResolvedValue(new Message(true))

    mediaReturnLogic = new MediaReturnLogic(mockDbContextFactory, mockMediaInventoryLogic)
})

describe("A media item cannot be returned by user if...", () => {
    test("there is no record of the user borrowing the given media item.", async () => {
        mockMediaBorrowingRepository.getMediaBorrowingRecordById.mockResolvedValue(null)
        const result = await mediaReturnLogic.returnMediaItem(mediaBorrowingRecordId)

        expect(result.errors[0]).toBeInstanceOf(InvalidBorrowingRecordError)
        expect(result.value).toBe(false)
    })
})

describe("When a media item is returned by a user...", () => {
    test("the media item's availability count is updated.", async () => {
        const result = await mediaReturnLogic.returnMediaItem(mediaBorrowingRecordId)

        expect(result.value).toBe(true)
        expect(mockMediaInventoryLogic.incrementMediaItemAvailabilityAtBranch).toHaveBeenCalledWith(genericMediaInventoryRecord.mediaId, genericMediaInventoryRecord.branchId)
    })

    test("the associated media borrowing record is archived", async () => {
        const result = await mediaReturnLogic.returnMediaItem(mediaBorrowingRecordId)

        expect(result.value).toBe(true)
        expect(mockMediaBorrowingRepository.archiveMediaBorrowingRecord).toHaveBeenCalled()
    })
})