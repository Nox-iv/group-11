import 'reflect-metadata'
import { IDbContext } from "../../interfaces/data/uow";
import { IMediaBorrowingRepository, IMediaRepository, IUserRepository } from "../../interfaces/data/repositories";
import { IMediaBorrowingLogic } from "../../interfaces/logic/borrowing/IMediaBorrowingLogic";
import { MediaBorrowingLogic } from "./MediaBorrowingLogic";
import { Message } from "../../interfaces/messaging/Message";
import { MediaBorrowingRecord } from "../../interfaces/dto";
import { InvalidUserError } from '../errors/invalidUserError';
import { InvalidMediaError } from '../errors/invalidMediaError';
import { InvalidBorrowingRecordError } from '../errors/invalidBorrowingRecordError';
import { IMediaBorrowingDateValidator } from '../../interfaces/logic/date-validator/IMediaBorrowingDateValidator';
import { InvalidBorrowingDateError, UnavailableMediaItemError } from '../errors';
import { MediaItem } from '../../interfaces/dto/MediaItem';

jest.mock('../../interfaces/logic/date-validator/IMediaBorrowingDateValidator')
jest.mock("../../interfaces/data/uow")
jest.mock("../../interfaces/data/repositories")

let mockMediaBorrowingRepository : jest.Mocked<IMediaBorrowingRepository>;
let mockUserRepository : jest.Mocked<IUserRepository>
let mockMediaRepository : jest.Mocked<IMediaRepository>
let mockDbContext : jest.Mocked<IDbContext>
let mockMediaBorrowingDateValidator : jest.Mocked<IMediaBorrowingDateValidator>
let mediaBorrowingLogic : IMediaBorrowingLogic
let genericMediaBorrowingRecord : MediaBorrowingRecord
let genericMediaItem : MediaItem

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

    genericMediaItem = {
        mediaId: 1,
        branchId: 1,
        availability: 1
    }

    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 14)

    genericMediaBorrowingRecord.endDate = endDate

    // Setup mock repositories.
    mockMediaBorrowingRepository = new IMediaBorrowingRepository() as jest.Mocked<IMediaBorrowingRepository>
    mockMediaBorrowingRepository.hasBorrowingRecord.mockResolvedValue(new Message(false))

    mockUserRepository = new IUserRepository as jest.Mocked<IUserRepository>
    mockUserRepository.hasUser.mockResolvedValue(new Message(true))

    mockMediaRepository = new IMediaRepository as jest.Mocked<IMediaRepository>
    mockMediaRepository.hasMedia.mockResolvedValue(new Message(true))
    mockMediaRepository.getMedia.mockResolvedValue(new Message(genericMediaItem))

    // Setup mock DB context.
    mockDbContext = new IDbContext() as jest.Mocked<IDbContext>;
    mockDbContext.getMediaBorrowingRepository.mockResolvedValue(mockMediaBorrowingRepository)
    mockDbContext.getUserRepository.mockResolvedValue(mockUserRepository)
    mockDbContext.getMediaRepository.mockResolvedValue(mockMediaRepository)

    // Setup logic dependencies
    mockMediaBorrowingDateValidator = new IMediaBorrowingDateValidator as jest.Mocked<IMediaBorrowingDateValidator>
    mockMediaBorrowingDateValidator.validateBorrowingDates.mockReturnValue(new Message(true))

    // Setup media borrowing logic.
    mediaBorrowingLogic = new MediaBorrowingLogic(mockDbContext, mockMediaBorrowingDateValidator)
});

describe("A media item cannot be borrowed if ...", () => {
    test("the dates provided are invalid", async () => {
        mockMediaBorrowingDateValidator.validateBorrowingDates.mockReturnValue(new Message(false, [new InvalidBorrowingDateError()]))

        const result = await mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(result.errors[0]).toBeInstanceOf(InvalidBorrowingDateError)
        expect(result.value).toBe(false)
    })

    test("the provided user ID does not exist.", async () => {
        mockUserRepository.hasUser.mockResolvedValue(new Message(false))

        const result = await mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(result.errors[0]).toBeInstanceOf(InvalidUserError)
        expect(result.value).toBe(false)
    })

    test("the provided media ID does not exist.", async () => {
        mockMediaRepository.getMedia.mockResolvedValue(new Message())

        const result = await mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(result.errors[0]).toBeInstanceOf(InvalidMediaError)
        expect(result.value).toBe(false)
    })

    test("the user is already borrowing the requested media item.", async () => {
        mockMediaBorrowingRepository.hasBorrowingRecord.mockResolvedValue(new Message(true))

        const result = await mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(result.errors[0]).toBeInstanceOf(InvalidBorrowingRecordError)
        expect(result.value).toBe(false)
    })

    test("the requested media item is unavailable at the given branch location.", async () => {
        genericMediaItem.availability = 0
        
        const result = await mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(result.errors[0]).toBeInstanceOf(UnavailableMediaItemError)
        expect(result.value).toBe(false)
    })
})  

describe("When a media item is borrowed by a user...", () => {
    test("the media borrowing databse is updated", async () => {
        const result = await mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(mockMediaBorrowingRepository.insertBorrowingRecord).toHaveBeenCalled()
        expect(result.value).toBe(true)
    })
})