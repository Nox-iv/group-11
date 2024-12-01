import { Message } from "../../../shared/messaging/Message";
import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { IDbContext } from "../../../db/interfaces/dbContext";

export class IUserEligibilityLogic {
    //@ts-ignore
    protected dbContext : IDbContext

    constructor() {}

    public isUserEligibleToBorrowMediaItemAtBranch(userId : number, mediaId : number, branchId : number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }
}