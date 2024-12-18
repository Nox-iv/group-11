import { Message } from "../../../shared/messaging/Message";
import { Service } from "typedi";
import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { IDbContextFactory } from "../../../db/interfaces/dbContext/IDbContextFactory";

export class IUserEligibilityLogic {
    //@ts-ignore
    protected dbContextFactory : IDbContextFactory

    constructor() {}

    public isUserEligibleToBorrowMediaItemAtBranch(userId : number, mediaId : number, branchId : number) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }
}