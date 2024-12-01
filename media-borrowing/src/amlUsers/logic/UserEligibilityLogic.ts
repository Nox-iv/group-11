import { IDbContext } from "../../db/interfaces/dbContext"
import { Message } from "../../shared/messaging/Message"
import { IUserEligibilityLogic } from "../interfaces/logic/IUserEligibilityLogic"
import { User } from "../data/models/user"
import { InvalidLocationError } from "./errors/invalidLocationError"

export class UserEligibilityLogic extends IUserEligibilityLogic {
    constructor(dbContext : IDbContext) {
        super()
        this.dbContext = dbContext
    }

    public async IsUserEligibleToBorrowMediaItemAtBranch(userId : number, mediaId : number, branchId : number) : Promise<Message<boolean>> {
        const result = new Message(false)
        try {
            const user =  await this.getUser(userId)
            await this.verifyUserIsInSameCityAsBranch(user.locationId, branchId, result)

            if (!result.hasErrors()) {
                result.value = true
                this.dbContext.commit()
            } else {
                this.dbContext.rollback()
            }
        } catch (e) {
            result.addError(e as Error)
            this.dbContext.rollback()
        } finally {
            return result
        }
    }

    private async getUser(userId : number) : Promise<User> {
        const userRepository = await this.dbContext.getUserRepository()
        return await userRepository.getUser(userId)
    }

    private async verifyUserIsInSameCityAsBranch(userLocationId : number, branchId : number, result : Message<boolean>) : Promise<void> {
        const branchRepository = await this.dbContext.getBranchRepository()
        const branchLocationId = await branchRepository.getBranchLocationId(branchId)

        if (!(branchLocationId == userLocationId)) {
            result.addError(new InvalidLocationError(`User's location ${userLocationId} does not match branch's location ${branchLocationId}`))
        }
    }
}