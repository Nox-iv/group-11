import 'reflect-metadata'
import { IMediaBorrowingRepository, IMediaRepository } from "../../interfaces/data/repositories"
import { IDbContext } from "../../interfaces/data/uow"
import { IMediaReturnLogic } from "../../interfaces/logic/return/IMediaReturnLogic"
import { InvalidBorrowingRecordError } from "../errors"
import { MediaReturnLogic } from "./mediaReturnLogic"
import { Message } from '../../interfaces/messaging/Message'
import { MediaBorrowingRecord } from '../../interfaces/dto'
import { MediaItem } from '../../interfaces/dto/MediaItem'

jest.mock("../../interfaces/data/repositories")
jest.mock("../../interfaces/data/uow")

let mockMediaBorrowingRepository : jest.Mocked<IMediaBorrowingRepository>
let mockMediaRepository : jest.Mocked<IMediaRepository>
let mockDbContext : jest.Mocked<IDbContext>
let mediaReturnLogic : IMediaReturnLogic
let mediaBorrowingRecordId : number
let genericMediaBorrowingRecord : MediaBorrowingRecord
let genericMediaItem : MediaItem

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

    genericMediaItem = {
        mediaId : 1,
        branchId : 1,
        availability : 1
    }

    // Setup mock repositories 
    mockMediaBorrowingRepository = new IMediaBorrowingRepository as jest.Mocked<IMediaBorrowingRepository>
    mockMediaBorrowingRepository.getBorrowingRecordById.mockResolvedValue(new Message(genericMediaBorrowingRecord))
    mockMediaBorrowingRepository.archiveBorrowingRecord.mockResolvedValue(new Message(true))

    mockMediaRepository = new IMediaRepository as jest.Mocked<IMediaRepository>
    mockMediaRepository.getByMediaAndBranchId.mockResolvedValue(new Message(genericMediaItem))
    mockMediaRepository.updateMediaItem.mockResolvedValue(new Message(true))

    // Setup db context
    mockDbContext = new IDbContext as jest.Mocked<IDbContext>
    mockDbContext.getMediaBorrowingRepository.mockResolvedValue(mockMediaBorrowingRepository)
    mockDbContext.getMediaRepository.mockResolvedValue(mockMediaRepository)

    // Setup logic
    mediaReturnLogic = new MediaReturnLogic(mockDbContext)
})

describe("A media item cannot be returned by user if...", () => {
    test("there is no record of the user borrowing the given media item.", async () => {
        mockMediaBorrowingRepository.getBorrowingRecordById.mockResolvedValue(new Message<MediaBorrowingRecord>(null, [new InvalidBorrowingRecordError()]))
        const result = await mediaReturnLogic.returnMediaItem(mediaBorrowingRecordId)

        expect(result.errors[0]).toBeInstanceOf(InvalidBorrowingRecordError)
        expect(result.value).toBe(false)
    })
})

describe("When a media item is returned by a user...", () => {
    test("the media item's availability count is updated.", async () => {
        const expectedAvailability = genericMediaItem.availability + 1
        const result = await mediaReturnLogic.returnMediaItem(mediaBorrowingRecordId)

        expect(result.value).toBe(true)
        expect(genericMediaItem.availability).toBe(expectedAvailability)
        expect(mockMediaRepository.updateMediaItem).toHaveBeenLastCalledWith(genericMediaItem)
    })

    test("the associated media borrowing record is archived", async () => {
        const result = await mediaReturnLogic.returnMediaItem(mediaBorrowingRecordId)

        expect(result.value).toBe(true)
        expect(mockMediaBorrowingRepository.archiveBorrowingRecord).toHaveBeenCalledWith(mediaBorrowingRecordId)
    })
})