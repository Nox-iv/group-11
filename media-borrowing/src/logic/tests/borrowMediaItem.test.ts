import 'reflect-metadata'
import { IDbContext } from "../../interfaces/data/uow";
import { IMediaBorrowingRepository, IMediaRepository, IUserRepository } from "../../interfaces/data/repositories";
import { IMediaBorrowingLogic } from "../../interfaces/logic/IMediaBorrowingLogic";
import { MediaBorrowingLogic } from "../MediaBorrowingLogic";
import { Message } from "../../interfaces/messaging/Message";
import { MediaBorrowingRecord } from "../../interfaces/dto";
import { InvalidBorrowingDateError } from "../errors/invalidBorrowingDateError";
import { InvalidUserError } from '../errors/invalidUserError';
import { InvalidMediaError } from '../errors/invalidMediaError';
import { InvalidBorrowingRecordError } from '../errors/invalidBorrowingRecordError';

jest.mock("../../interfaces/data/uow")
jest.mock("../../interfaces/data/repositories")

let mockMediaBorrowingRepository : jest.Mocked<IMediaBorrowingRepository>;
let mockUserRepository : jest.Mocked<IUserRepository>
let mockMediaRepository : jest.Mocked<IMediaRepository>
let mockDbContext : jest.Mocked<IDbContext>
let mediaBorrowingLogic : IMediaBorrowingLogic
let genericMediaBorrowingRecord : MediaBorrowingRecord

beforeEach(() => {
    // Setup mock repositories.
    mockMediaBorrowingRepository = new IMediaBorrowingRepository() as jest.Mocked<IMediaBorrowingRepository>
    mockMediaBorrowingRepository.hasBorrowingRecord.mockResolvedValue(new Message(false))

    mockUserRepository = new IUserRepository as jest.Mocked<IUserRepository>
    mockUserRepository.hasUser.mockResolvedValue(new Message(true))

    mockMediaRepository = new IMediaRepository as jest.Mocked<IMediaRepository>
    mockMediaRepository.hasMedia.mockResolvedValue(new Message(true))

    // Setup mock DB context.
    mockDbContext = new IDbContext() as jest.Mocked<IDbContext>;
    mockDbContext.getMediaBorrowingRepository.mockResolvedValue(mockMediaBorrowingRepository)
    mockDbContext.getUserRepository.mockResolvedValue(mockUserRepository)
    mockDbContext.getMediaRepository.mockResolvedValue(mockMediaRepository)

    // Setup media borrowing logic.
    mediaBorrowingLogic = new MediaBorrowingLogic(mockDbContext)

    // Setup data.
    genericMediaBorrowingRecord = {
        userId: 1,
        mediaId: 1,
        startDate: new Date(),
        endDate: new Date(),
        renewals: 0
    }

    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 14)

    genericMediaBorrowingRecord.endDate = endDate
});

describe("A media item cannot be borrowed if ...", () => {
    test("the start date has been set to a date later than the end date.", async () => {
        genericMediaBorrowingRecord.startDate = new Date(genericMediaBorrowingRecord.endDate)
        genericMediaBorrowingRecord.startDate.setDate(genericMediaBorrowingRecord.startDate.getDate() + 1)

        const result = await mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(result.errors[0]).toBeInstanceOf(InvalidBorrowingDateError)
        expect(result.value).toBe(false)
    })

    test("the end date is less than one day after the start date.", async () => {
        genericMediaBorrowingRecord.endDate = new Date(genericMediaBorrowingRecord.startDate)
        genericMediaBorrowingRecord.endDate.setHours(genericMediaBorrowingRecord.endDate.getHours() + 1)

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
        mockMediaRepository.hasMedia.mockResolvedValue(new Message(false))

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
})

describe("When a media item is borrowed...", () => {
    test("the media borrowing databse is updated", async () => {
        const result = await mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(mockMediaBorrowingRepository.insertBorrowingRecord).toHaveBeenCalled()
        expect(result.value).toBe(true)
    })
})

