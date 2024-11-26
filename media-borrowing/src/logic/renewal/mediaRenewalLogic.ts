import { IMediaRenewalLogic } from "../../interfaces/logic/renewal/IMediaRenewalLogic";
import { MediaBorrowingRecord } from "../../interfaces/dto";
import { Message } from "../../interfaces/messaging/Message";
import Container, { Inject } from "typedi";
import { IDbContext } from "../../interfaces/data/uow";
import { InvalidBorrowingRecordError, MaxRenewalsExceededError } from "../errors";
import { MAX_RENEWALS } from "../../config";

export class MediaRenewalLogic extends IMediaRenewalLogic {
    constructor(@Inject() dbContext : IDbContext) {
        super()
        this.dbContext = dbContext
    }

    public async renewMediaItem(mediaBorrowingRecord : MediaBorrowingRecord) : Promise<Message<boolean>> {
        const result = new Message(true)

        const mediaBorrowingRepository = await this.dbContext.getMediaBorrowingRepository()
        const mediaBorrowingConfigRepository = await this.dbContext.getMediaBorrowingConfigRepository()

        const existingMediaBorrowingRecordResult = await mediaBorrowingRepository.getBorrowingRecord(mediaBorrowingRecord.userId, mediaBorrowingRecord.mediaId)
        const existingMediaBorrowingRecord = existingMediaBorrowingRecordResult.value

        if (existingMediaBorrowingRecord == null) {
            result.addError(new InvalidBorrowingRecordError(`User ${mediaBorrowingRecord.userId} is not currently borrowing ${mediaBorrowingRecord.mediaId}`))
        } else {
            const renewalsLimitResult = await mediaBorrowingConfigRepository.getRenewalLimit()
            const renewalsLimit = renewalsLimitResult.value ?? Container.get(MAX_RENEWALS)

            if (existingMediaBorrowingRecord.renewals >= renewalsLimit) {
                result.addError(new MaxRenewalsExceededError(`Maximum amount of renewals is ${renewalsLimit}.`))
            }
        }


        if (result.hasErrors()) {
            result.value = false
        }

        return result
    }
}