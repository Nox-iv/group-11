import 'reflect-metadata'
import { IDbContext } from '../../../db/interfaces/dbContext';
import { IMediaBorrowingRepository } from '../../interfaces/data/repositories';
import { IUserRepository } from '../../../amlUsers/interfaces/data/repositories/IUserRepository';
import { IMediaRepository } from '../../../mediaInventory/interfaces/data/repositories';
import { IMediaBorrowingLogic } from '../../interfaces/logic/mediaBorrowing/IMediaBorrowingLogic';
import { IMediaBorrowingDateValidator } from '../../interfaces/logic/mediaBorrowingDateValidation/IMediaBorrowingDateValidator';
import { Message } from '../../../shared/messaging/Message';
import { MediaBorrowingRecord } from '../../data/models';
import { InvalidUserError } from '../../../amlUsers/invalidUserError';
import { InvalidMediaError } from '../../../mediaInventory/logic/errors/invalidMediaError';
import { MediaBorrowingLogic, InvalidBorrowingRecordError, UnavailableMediaItemError } from '.';
import { MediaItem } from '../../../mediaInventory/data/models';
import { InvalidBorrowingDateError } from '../mediaBorrowingDateValidation/errors/invalidBorrowingDateError';

jest.mock('../../../db/interfaces/dbContext')
jest.mock('../../interfaces/data/repositories')
jest.mock('../../../amlUsers/interfaces/data/repositories/IUserRepository')
jest.mock('../../../mediaInventory/interfaces/data/repositories')
jest.mock('../../interfaces/logic/mediaBorrowingDateValidation/IMediaBorrowingDateValidator')


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
    mockMediaBorrowingRepository.checkBorrowingRecordExists.mockResolvedValue(new Message(false))

    mockUserRepository = new IUserRepository as jest.Mocked<IUserRepository>
    mockUserRepository.hasUser.mockResolvedValue(new Message(true))

    mockMediaRepository = new IMediaRepository as jest.Mocked<IMediaRepository>
    mockMediaRepository.branchHasMediaItem.mockResolvedValue(new Message(true))
    mockMediaRepository.getByMediaAndBranchId.mockResolvedValue(new Message(genericMediaItem))
    mockMediaRepository.updateMediaItem.mockResolvedValue(new Message(true))

    // Setup mock DB context.
    mockDbContext = new IDbContext() as jest.Mocked<IDbContext>;
    mockDbContext.getMediaBorrowingRepository.mockResolvedValue(mockMediaBorrowingRepository)
    mockDbContext.getUserRepository.mockResolvedValue(mockUserRepository)
    mockDbContext.getMediaRepository.mockResolvedValue(mockMediaRepository)

    // Setup logic dependencies
    mockMediaBorrowingDateValidator = new IMediaBorrowingDateValidator as jest.Mocked<IMediaBorrowingDateValidator>
    mockMediaBorrowingDateValidator.validateBorrowingDates.mockResolvedValue(new Message(true))

    // Setup media borrowing logic.
    mediaBorrowingLogic = new MediaBorrowingLogic(mockDbContext, mockMediaBorrowingDateValidator)
});

describe("A media item cannot be borrowed if ...", () => {
    test("the dates provided are invalid", async () => {
        mockMediaBorrowingDateValidator.validateBorrowingDates.mockResolvedValue(new Message(false, [new InvalidBorrowingDateError()]))

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
        mockMediaRepository.getByMediaAndBranchId.mockResolvedValue(new Message())

        const result = await mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(result.errors[0]).toBeInstanceOf(InvalidMediaError)
        expect(result.value).toBe(false)
    })

    test("the user is already borrowing the requested media item.", async () => {
        mockMediaBorrowingRepository.checkBorrowingRecordExists.mockResolvedValue(new Message(true))

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

    test("the media item's availability is updated", async () => {
        const expectedAvailability = genericMediaItem.availability - 1
        const result = await mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(result.value).toBe(true)
        expect(genericMediaItem.availability).toBe(expectedAvailability)
        expect(mockMediaRepository.updateMediaItem).toHaveBeenCalledWith(genericMediaItem)
    })
})