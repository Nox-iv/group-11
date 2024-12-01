import 'reflect-metadata'
import { Message } from "../../shared/messaging/Message"
import { IDbContext } from "../../db/interfaces/dbContext"
import { MediaItem } from "../data/models"
import { IMediaRepository } from "../interfaces/data/repositories"
import { InvalidMediaError } from "./errors/invalidMediaError"
import { MediaInventoryLogic } from "./mediaInventoryLogic"

let genericMediaItem : MediaItem
let mockMediaRepository : jest.Mocked<IMediaRepository>
let mockDbContext : jest.Mocked<IDbContext>
let mediaInventoryLogic : MediaInventoryLogic

jest.mock("../interfaces/data/repositories")
jest.mock("../../db/interfaces/dbContext")

beforeEach(() => {
    // Setup data
    genericMediaItem = {
        mediaId : 1,
        branchId : 1,
        availability : 1
    }

    // Setup repositories
    mockMediaRepository = new IMediaRepository as jest.Mocked<IMediaRepository>
    mockMediaRepository.getByMediaAndBranchId.mockResolvedValue(new Message(genericMediaItem))
    mockMediaRepository.updateMediaItem.mockResolvedValue(new Message(true))

    // Setup db context
    mockDbContext = new IDbContext as jest.Mocked<IDbContext>
    mockDbContext.getMediaRepository.mockResolvedValue(mockMediaRepository)


    // Setup logic
    mediaInventoryLogic = new MediaInventoryLogic(mockDbContext)
})

describe("A media item's availability cannot be updated if...", () => {
    test("the media-branch combination is invalid", async () => {
        mockMediaRepository.getByMediaAndBranchId.mockResolvedValue(new Message<MediaItem>(null))

        const incrementResult = await mediaInventoryLogic.incrementMediaItemAvailabilityAtBranch(genericMediaItem.mediaId, genericMediaItem.branchId)
        const decrementResult = await mediaInventoryLogic.decrementMediaItemAvailabilityAtBranch(genericMediaItem.mediaId, genericMediaItem.branchId)

        expect(incrementResult.value).toBe(false)
        expect(decrementResult.value).toBe(false)
        expect(incrementResult.errors[0]).toBeInstanceOf(InvalidMediaError)
        expect(decrementResult.errors[0]).toBeInstanceOf(InvalidMediaError)
    })
})

describe("A media item's availability is correctly updated when...", () => {
    test("the media item's availability is incremented", async () => {
        const expectedAvailability = genericMediaItem.availability + 1

        const result = await mediaInventoryLogic.incrementMediaItemAvailabilityAtBranch(genericMediaItem.mediaId, genericMediaItem.branchId)

        expect(result.value).toBe(true)
        expect(genericMediaItem.availability).toBe(expectedAvailability)
        expect(mockMediaRepository.updateMediaItem).toHaveBeenCalledWith(genericMediaItem)
    })

    test("the media item's availability is decremented", async () => {
        const expectedAvailability = genericMediaItem.availability - 1

        const result = await mediaInventoryLogic.decrementMediaItemAvailabilityAtBranch(genericMediaItem.mediaId, genericMediaItem.branchId)

        expect(result.value).toBe(true)
        expect(genericMediaItem.availability).toBe(expectedAvailability)
        expect(mockMediaRepository.updateMediaItem).toHaveBeenCalledWith(genericMediaItem)
    })
})