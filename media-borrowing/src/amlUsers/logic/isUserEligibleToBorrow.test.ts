import { IBranchRepository } from "../../amlBranches/interfaces/data/repositories"
import { IDbContext } from "../../db/interfaces/dbContext"
import { IUserRepository } from "../interfaces/data/repositories/IUserRepository"
import { IUserEligibilityLogic } from "../interfaces/logic/IUserEligibilityLogic"
import { UserEligibilityLogic } from "./UserEligibilityLogic"
import { User } from "../data/models/user"
import { InvalidUserError } from "../invalidUserError"
import { InvalidLocationError } from "./errors/invalidLocationError"
import { InvalidBranchError } from "../../amlBranches/logic/errors/invalidBranchError"

jest.mock("../../db/interfaces/dbContext")
jest.mock("../interfaces/data/repositories/IUserRepository")
jest.mock("../../amlBranches/interfaces/data/repositories")

let userEligibilityLogic : IUserEligibilityLogic
let mockBranchRepository : jest.Mocked<IBranchRepository>
let mockUserRepository : jest.Mocked<IUserRepository>
let mockDbContext : jest.Mocked<IDbContext>
let user : User
let userId : number
let mediaId : number 
let branchId : number
let validBranchLocationId : number
let invalidBranchLocationId : number

beforeEach(() => {
    // Setup data
    userId = 1
    mediaId = 1
    branchId = 1
    validBranchLocationId = 1
    invalidBranchLocationId = 2

    user = {
        userId,
        locationId : 1
    }

    // Setup Repositories
    mockBranchRepository = new IBranchRepository as jest.Mocked<IBranchRepository>
    mockBranchRepository.getBranchLocationId.mockResolvedValue(validBranchLocationId)

    mockUserRepository = new IUserRepository as jest.Mocked<IUserRepository>
    mockUserRepository.getUser.mockResolvedValue(user)

    // Setup db context
    mockDbContext = new IDbContext as jest.Mocked<IDbContext>
    mockDbContext.getBranchRepository.mockResolvedValue(mockBranchRepository)
    mockDbContext.getUserRepository.mockResolvedValue(mockUserRepository)

    // Setup logic
    userEligibilityLogic = new UserEligibilityLogic(mockDbContext)
})

describe("A user is not eligible to borrow an item if...", () => {
    test("the branch they are borrowing from is outside the city where they hold their membership", async () => {
        mockBranchRepository.getBranchLocationId.mockResolvedValue(invalidBranchLocationId)

        const result = await userEligibilityLogic.IsUserEligibleToBorrowMediaItemAtBranch(userId, mediaId, branchId)

        expect(result.value).toBe(false)
        expect(result.errors[0]).toBeInstanceOf(InvalidLocationError)
    })

    test("the given user does not exist", async () => {
        mockUserRepository.getUser.mockResolvedValue(null)

        const result = await userEligibilityLogic.IsUserEligibleToBorrowMediaItemAtBranch(userId, mediaId, branchId)

        expect(result.value).toBe(false)
        expect(result.errors[0]).toBeInstanceOf(InvalidUserError)
    })

    test("the given branch does not exist", async () => {
        mockBranchRepository.getBranchLocationId.mockResolvedValue(null)

        const result = await userEligibilityLogic.IsUserEligibleToBorrowMediaItemAtBranch(userId, mediaId, branchId)

        expect(result.value).toBe(false)
        expect(result.errors[0]).toBeInstanceOf(InvalidBranchError)
    })
})

describe("A user is elgibile to borrow a media item...", () => {
    test("if they borrow from a branch in the city where the hold their membership", async () => {
        const result = await userEligibilityLogic.IsUserEligibleToBorrowMediaItemAtBranch(userId, mediaId, branchId)

        expect(result.value).toBe(true)
    })
})