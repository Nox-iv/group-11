import 'reflect-metadata'
import { IDbContext, IDbContextFactory } from "../../../db/interfaces/dbContext"
import { MediaInventoryRecord } from "../../data/models"
import { IMediaInventoryRepository } from "../../interfaces/data/repositories"
import { InvalidMediaError } from "../errors/invalidMediaError"
import { MediaInventoryLogic } from "../mediaInventoryLogic"

let genericMediaInventoryRecord : MediaInventoryRecord
let mockMediaInventoryRepository : jest.Mocked<IMediaInventoryRepository>
let mockDbContext : jest.Mocked<IDbContext>
let mockDbContextFactory : jest.Mocked<IDbContextFactory>
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


    // Setup db context factory
    mockDbContextFactory = new IDbContextFactory as jest.Mocked<IDbContextFactory>
    mockDbContextFactory.create.mockResolvedValue(mockDbContext)

    // Setup logic
    mediaInventoryLogic = new MediaInventoryLogic(mockDbContextFactory)
})

describe("The correct availability status is returned when...", () => {
    test("a media item is unavailable", async () => {
        genericMediaInventoryRecord.availability = 0

        const result = await mediaInventoryLogic.isMediaItemAvailableAtBranch(genericMediaInventoryRecord.mediaId, genericMediaInventoryRecord.branchId)

        expect(result.value).toBe(false)
        expect(result.errors.length).toBe(0)
    })

    test("a media item is available", async () => {
        const result = await mediaInventoryLogic.isMediaItemAvailableAtBranch(genericMediaInventoryRecord.mediaId, genericMediaInventoryRecord.branchId)
        expect(result.value).toBe(true)
    })
})

describe("If the given media-branch combination is invalid...", () => {
    test("an error is returned in the result", async () => {
        mockMediaInventoryRepository.getInventoryByMediaAndBranchId.mockResolvedValue(null)

        const result = await mediaInventoryLogic.isMediaItemAvailableAtBranch(genericMediaInventoryRecord.mediaId, genericMediaInventoryRecord.branchId)

        expect(result.value).toBe(false)
        expect(result.errors[0]).toBeInstanceOf(InvalidMediaError)
    })
})

