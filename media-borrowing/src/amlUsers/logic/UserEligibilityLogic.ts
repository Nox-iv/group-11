import { IDbContext } from "../../db/interfaces/dbContext"
import { Message } from "../../shared/messaging/Message"
import { IUserEligibilityLogic } from "../interfaces/logic/IUserEligibilityLogic"
import { User } from "../data/models/user"
import { InvalidLocationError } from "./errors/invalidLocationError"
import { InvalidUserError } from "./errors/invalidUserError"
import { InvalidBranchError } from "../../amlBranches/logic/errors/invalidBranchError"
import { IDbContextFactory } from "../../db/interfaces/dbContext/IDbContextFactory"
import { Inject, Service } from "typedi"

@Service()
export class UserEligibilityLogic extends IUserEligibilityLogic {
    constructor(@Inject() dbContextFactory : IDbContextFactory) {
        super()
        this.dbContextFactory = dbContextFactory
    }

    public async isUserEligibleToBorrowMediaItemAtBranch(userId : number, mediaId : number, branchId : number) : Promise<Message<boolean>> {
        const result = new Message(false)
        const dbContext = await this.dbContextFactory.create()

        try {
            const user =  await this.getUser(userId, dbContext)
            await this.verifyUserIsInSameCityAsBranch(user.locationId, branchId, dbContext, result)

            if (!result.hasErrors()) {
                result.value = true
                await dbContext.commit()
            } else {
                await dbContext.rollback()
            }
        } catch (e) {
            result.addError(e as Error)
            result.value = false
            await dbContext.rollback()
        } finally {
            return result
        }
    }

    private async getUser(userId : number, dbContext : IDbContext) : Promise<User> {
        const userRepository = await dbContext.getUserRepository()
        const user = await userRepository.getUser(userId)

        if (user == null) {
            throw new InvalidUserError(`User ${userId} does not exist.`)
        }

        return user
    }

    private async verifyUserIsInSameCityAsBranch(userLocationId : number, branchId : number, dbContext : IDbContext, result : Message<boolean>) : Promise<void> {
        const branchRepository = await dbContext.getBranchRepository()
        const branchLocationId = await branchRepository.getBranchLocationId(branchId)

        if (branchLocationId == null) {
            throw new InvalidBranchError(`Could not find a location associated with branch ${branchId}`)
        } else if (branchLocationId != userLocationId) {
            result.addError(new InvalidLocationError(`User's location ${userLocationId} does not match branch's location ${branchLocationId}`))
        }
    }
}