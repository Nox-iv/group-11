import { IDbContext } from "../../data/uow";
import { MediaRenewalRequest } from "../../dto/MediaRenewalRequest";
import { NotImplementedError } from "../../errors/notImplementedError";
import { Message } from "../../messaging/Message";
import { IMediaBorrowingDateValidator } from "../date-validator/IMediaBorrowingDateValidator";

export class IMediaRenewalLogic {
    //@ts-ignore
    protected dbContext : IDbContext

    //@ts-ignore
    protected mediaBorrowingDateValidator : IMediaBorrowingDateValidator

    constructor () {}

    public renewMediaItem(mediaRenewalRequest : MediaRenewalRequest) : Promise<Message<boolean>> {
        throw new NotImplementedError()
    }
}