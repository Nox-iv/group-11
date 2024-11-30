import { IDbContext } from "../../../../db/interfaces/dbContext";
import { MediaRenewalRequest } from "../../../logic/mediaRenewals/dto/MediaRenewalRequest";
import { NotImplementedError } from "../../../../shared/errors/notImplementedError";
import { Message } from "../../../../shared/messaging/Message";
import { IMediaBorrowingDateValidator } from "../mediaBorrowingDateValidation/IMediaBorrowingDateValidator";

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