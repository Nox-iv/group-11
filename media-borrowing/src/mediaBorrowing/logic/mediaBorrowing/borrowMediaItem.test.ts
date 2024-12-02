import 'reflect-metadata'
import { IDbContext } from '../../../db/interfaces/dbContext';
import { IMediaBorrowingRepository } from '../../interfaces/data/repositories';
import { IMediaBorrowingLogic } from '../../interfaces/logic/mediaBorrowing/IMediaBorrowingLogic';
import { IMediaBorrowingDateValidator } from '../../interfaces/logic/mediaBorrowingDateValidation/IMediaBorrowingDateValidator';
import { Message } from '../../../shared/messaging/Message';
import { MediaBorrowingRecord } from '../../data/models';
import { InvalidUserError } from '../../../amlUsers/logic/errors/invalidUserError';
import { InvalidMediaError } from '../../../mediaInventory/logic/errors/invalidMediaError';
import { MediaBorrowingLogic, InvalidBorrowingRecordError, UnavailableMediaItemError } from '.';
import { MediaItem } from '../../../mediaInventory/data/models';
import { InvalidBorrowingDateError } from '../mediaBorrowingDateValidation/errors/invalidBorrowingDateError';
import { IMediaInventoryLogic } from '../../../mediaInventory/interfaces/logic/IMediaInventoryLogic';
import { IUserEligibilityLogic } from '../../../amlUsers/interfaces/logic/IUserEligibilityLogic';

jest.mock('../../../db/interfaces/dbContext')
jest.mock('../../interfaces/data/repositories')
jest.mock('../../../mediaInventory/interfaces/logic/IMediaInventoryLogic')
jest.mock('../../interfaces/logic/mediaBorrowingDateValidation/IMediaBorrowingDateValidator')
jest.mock('../../../amlUsers/interfaces/logic/IUserEligibilityLogic')


let mockMediaBorrowingRepository : jest.Mocked<IMediaBorrowingRepository>;
let mockDbContext : jest.Mocked<IDbContext>
let mockMediaBorrowingDateValidator : jest.Mocked<IMediaBorrowingDateValidator>
let mockMediaInventoryLogic : jest.Mocked<IMediaInventoryLogic>
let mockUserEligibilityLogic : jest.Mocked<IUserEligibilityLogic>
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
        mediaItemId: 1,
        mediaId: 1,
        branchId: 1,
        availability: 1
    }

    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 14)

    genericMediaBorrowingRecord.endDate = endDate

    // Setup mock repositories.
    mockMediaBorrowingRepository = new IMediaBorrowingRepository() as jest.Mocked<IMediaBorrowingRepository>
    mockMediaBorrowingRepository.hasBorrowingRecord.mockResolvedValue(false)

    // Setup mock DB context.
    mockDbContext = new IDbContext() as jest.Mocked<IDbContext>;
    mockDbContext.getMediaBorrowingRepository.mockResolvedValue(mockMediaBorrowingRepository)

    // Setup logic dependencies
    mockUserEligibilityLogic = new IUserEligibilityLogic as jest.Mocked<IUserEligibilityLogic> 
    mockUserEligibilityLogic.isUserEligibleToBorrowMediaItemAtBranch.mockResolvedValue(new Message(true))

    mockMediaBorrowingDateValidator = new IMediaBorrowingDateValidator as jest.Mocked<IMediaBorrowingDateValidator>
    mockMediaBorrowingDateValidator.validateBorrowingDates.mockResolvedValue(new Message(true))

    mockMediaInventoryLogic = new IMediaInventoryLogic as jest.Mocked<IMediaInventoryLogic>
    mockMediaInventoryLogic.isMediaItemAvailableAtBranch.mockResolvedValue(new Message(true))
    mockMediaInventoryLogic.incrementMediaItemAvailabilityAtBranch.mockResolvedValue(new Message(true))

    // Setup media borrowing logic.
    mediaBorrowingLogic = new MediaBorrowingLogic(mockDbContext, mockUserEligibilityLogic, mockMediaInventoryLogic, mockMediaBorrowingDateValidator)
});

describe("A media item cannot be borrowed if ...", () => {
    test("the dates provided are invalid", async () => {
        mockMediaBorrowingDateValidator.validateBorrowingDates.mockResolvedValue(new Message(false, [new InvalidBorrowingDateError()]))

        const result = await mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(result.errors[0]).toBeInstanceOf(InvalidBorrowingDateError)
        expect(result.value).toBe(false)
    })

    test("the provided user ID does not exist.", async () => {
        mockUserEligibilityLogic.isUserEligibleToBorrowMediaItemAtBranch.mockResolvedValue(new Message(false, [new InvalidUserError()]))

        const result = await mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(result.errors[0]).toBeInstanceOf(InvalidUserError)
        expect(result.value).toBe(false)
    })

    test("the provided media item does not exist.", async () => {
        mockMediaInventoryLogic.isMediaItemAvailableAtBranch.mockResolvedValue(new Message<boolean>(false, [new InvalidMediaError()]))

        const result = await mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(result.errors[0]).toBeInstanceOf(InvalidMediaError)
        expect(result.value).toBe(false)
    })

    test("the user is already borrowing the requested media item.", async () => {
        mockMediaBorrowingRepository.hasBorrowingRecord.mockResolvedValue(true)

        const result = await mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(result.errors[0]).toBeInstanceOf(InvalidBorrowingRecordError)
        expect(result.value).toBe(false)
    })

    test("the requested media item is unavailable at the given branch location.", async () => {
        mockMediaInventoryLogic.isMediaItemAvailableAtBranch.mockResolvedValue(new Message(false))
        
        const result = await mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(result.errors[0]).toBeInstanceOf(UnavailableMediaItemError)
        expect(result.value).toBe(false)
    })
})  

describe("When a media item is borrowed by a user...", () => {
    test("the media borrowing database is updated", async () => {
        const result = await mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(mockMediaBorrowingRepository.insertBorrowingRecord).toHaveBeenCalledWith(genericMediaBorrowingRecord)
        expect(result.value).toBe(true)
    })

    test("the media item's availability is updated", async () => {
        const result = await mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(result.value).toBe(true)
        expect(mockMediaInventoryLogic.decrementMediaItemAvailabilityAtBranch).toHaveBeenCalledWith(genericMediaItem.mediaId, genericMediaItem.branchId)
    })

    test("the renewals field is set to 0", async () => {
        genericMediaBorrowingRecord.renewals = 1
        const result = await mediaBorrowingLogic.BorrowMediaItem(genericMediaBorrowingRecord)

        expect(result.value).toBe(true)
        expect(genericMediaBorrowingRecord.renewals).toBe(0)
    })
})