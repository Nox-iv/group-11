import { Message } from "../../../../shared/messaging/Message";
import { IDbContext } from "../../../../db/interfaces/dbContext";
import { MediaBorrowingRecord } from "../../../data/models";
import { IMediaBorrowingDateValidator } from "../mediaBorrowingDateValidation/IMediaBorrowingDateValidator";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";
import { IMediaInventoryLogic } from "../../../../mediaInventory/interfaces/logic/IMediaInventoryLogic";
import { IUserEligibilityLogic } from "../../../../amlUsers/interfaces/logic/IUserEligibilityLogic";

export class IMediaBorrowingLogic {
    //@ts-ignore
    protected dbContext : IDbContext

    //@ts-ignore
    protected mediaInventoryLogic : IMediaInventoryLogic

    //@ts-ignore
    protected mediaBorrowingDateValidator : IMediaBorrowingDateValidator

    //@ts-ignore
    protected userEligibilityLogic : IUserEligibilityLogic

    constructor() {}

    public BorrowMediaItem(mediaBorrowingRecord : MediaBorrowingRecord) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }  
}