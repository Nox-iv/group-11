import 'reflect-metadata'
import { IDbContext } from "../../../db/interfaces/dbContext"
import { MediaInventoryRecord } from "../../data/models"
import { IMediaInventoryRepository } from "../../interfaces/data/repositories"
import { InvalidMediaError } from "../errors/invalidMediaError"
import { MediaInventoryLogic } from "../mediaInventoryLogic"

let genericMediaInventoryRecord : MediaInventoryRecord
let mockMediaInventoryRepository : jest.Mocked<IMediaInventoryRepository>
let mockDbContext : jest.Mocked<IDbContext>
let mediaInventoryLogic : MediaInventoryLogic

jest.mock("../../interfaces/data/repositories")
jest.mock("../../../db/interfaces/dbContext")

beforeEach(() => {
    // Setup data
    genericMediaInventoryRecord = {
        mediaInventoryId : 1,
        mediaId : 1,
        branchId : 1,
        availability : 1
    }

    // Setup repositories
    mockMediaInventoryRepository = new IMediaInventoryRepository as jest.Mocked<IMediaInventoryRepository>
    mockMediaInventoryRepository.getInventoryByMediaAndBranchId.mockResolvedValue(genericMediaInventoryRecord)

    // Setup db context
    mockDbContext = new IDbContext as jest.Mocked<IDbContext>
    mockDbContext.getMediaInventoryRepository.mockResolvedValue(mockMediaInventoryRepository)


    // Setup logic
    mediaInventoryLogic = new MediaInventoryLogic(mockDbContext)
})

describe("A media item's availability cannot be updated if...", () => {
    test("the media-branch combination is invalid", async () => {
        mockMediaInventoryRepository.getInventoryByMediaAndBranchId.mockResolvedValue(null)

        const incrementResult = await mediaInventoryLogic.incrementMediaItemAvailabilityAtBranch(genericMediaInventoryRecord.mediaId, genericMediaInventoryRecord.branchId)
        const decrementResult = await mediaInventoryLogic.decrementMediaItemAvailabilityAtBranch(genericMediaInventoryRecord.mediaId, genericMediaInventoryRecord.branchId)

        expect(incrementResult.value).toBe(false)
        expect(decrementResult.value).toBe(false)
        expect(incrementResult.errors[0]).toBeInstanceOf(InvalidMediaError)
        expect(decrementResult.errors[0]).toBeInstanceOf(InvalidMediaError)
    })
})

describe("A media item's availability is correctly updated when...", () => {
    test("the media item's availability is incremented", async () => {
        const expectedAvailability = genericMediaInventoryRecord.availability + 1

        const result = await mediaInventoryLogic.incrementMediaItemAvailabilityAtBranch(genericMediaInventoryRecord.mediaId, genericMediaInventoryRecord.branchId)

        expect(result.value).toBe(true)
        expect(genericMediaInventoryRecord.availability).toBe(expectedAvailability)
        expect(mockMediaInventoryRepository.updateMediaItemAvailability).toHaveBeenCalledWith(genericMediaInventoryRecord)
    })

    test("the media item's availability is decremented", async () => {
        const expectedAvailability = genericMediaInventoryRecord.availability - 1

        const result = await mediaInventoryLogic.decrementMediaItemAvailabilityAtBranch(genericMediaInventoryRecord.mediaId, genericMediaInventoryRecord.branchId)

        expect(result.value).toBe(true)
        expect(genericMediaInventoryRecord.availability).toBe(expectedAvailability)
        expect(mockMediaInventoryRepository.updateMediaItemAvailability).toHaveBeenCalledWith(genericMediaInventoryRecord)
    })
})