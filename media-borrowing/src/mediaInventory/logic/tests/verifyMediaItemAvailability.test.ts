import 'reflect-metadata'
import { Message } from "../../../shared/messaging/Message"
import { IDbContext } from "../../../db/interfaces/dbContext"
import { MediaItem } from "../../data/models"
import { IMediaRepository } from "../../interfaces/data/repositories"
import { InvalidMediaError } from "../errors/invalidMediaError"
import { MediaInventoryLogic } from "../mediaInventoryLogic"

let genericMediaItem : MediaItem
let mockMediaRepository : jest.Mocked<IMediaRepository>
let mockDbContext : jest.Mocked<IDbContext>
let mediaInventoryLogic : MediaInventoryLogic

jest.mock("../../interfaces/data/repositories")
jest.mock("../../../db/interfaces/dbContext")

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

    // Setup db context
    mockDbContext = new IDbContext as jest.Mocked<IDbContext>
    mockDbContext.getMediaRepository.mockResolvedValue(mockMediaRepository)

    // Setup logic
    mediaInventoryLogic = new MediaInventoryLogic(mockDbContext)
})

describe("The correct availability status is returned when...", () => {
    test("a media item is unavailable", async () => {
        genericMediaItem.availability = 0

        const result = await mediaInventoryLogic.isMediaItemAvailableAtBranch(genericMediaItem.mediaId, genericMediaItem.branchId)

        expect(result.value).toBe(false)
        expect(result.errors.length).toBe(0)
    })

    test("a media item is available", async () => {
        const result = await mediaInventoryLogic.isMediaItemAvailableAtBranch(genericMediaItem.mediaId, genericMediaItem.branchId)
        expect(result.value).toBe(true)
    })
})

describe("If the given media-branch combination is invalid...", () => {
    test("an error is returned in the result", async () => {
        mockMediaRepository.getByMediaAndBranchId.mockResolvedValue(new Message<MediaItem>(null))

        const result = await mediaInventoryLogic.isMediaItemAvailableAtBranch(genericMediaItem.mediaId, genericMediaItem.branchId)

        expect(result.value).toBe(false)
        expect(result.errors[0]).toBeInstanceOf(InvalidMediaError)
    })
})

