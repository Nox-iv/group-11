import { IMediaRenewalLogic } from "../../interfaces/logic/renewal/IMediaRenewalLogic";
import { Message } from "../../interfaces/messaging/Message";
import Container, { Inject } from "typedi";
import { IDbContext } from "../../interfaces/data/uow";
import { InvalidBorrowingDateError, InvalidBorrowingRecordError, MaxRenewalsExceededError } from "../errors";
import { MAX_RENEWALS } from "../../config";
import { MediaRenewalRequest } from "../../interfaces/dto/MediaRenewalRequest";
import { IMediaBorrowingDateValidator } from "../../interfaces/logic/date-validator/IMediaBorrowingDateValidator";

export class MediaRenewalLogic extends IMediaRenewalLogic {
    constructor(
        @Inject() dbContext : IDbContext,
        @Inject() mediaBorrowingDateValidator : IMediaBorrowingDateValidator
    ) {
        super()
        this.dbContext = dbContext
        this.mediaBorrowingDateValidator = mediaBorrowingDateValidator
    }

    public async renewMediaItem(mediaRenewalRequest : MediaRenewalRequest) : Promise<Message<boolean>> {
        const result = new Message(false)

        try {
            const mediaBorrowingRepository = await this.dbContext.getMediaBorrowingRepository()

            const mediaBorrowingRecordResult = await mediaBorrowingRepository.getBorrowingRecord(mediaRenewalRequest.userId, mediaRenewalRequest.mediaId)
            const mediaBorrowingRecord = mediaBorrowingRecordResult.value
    
            if (mediaBorrowingRecord == null) {
                result.addError(new InvalidBorrowingRecordError(`User ${mediaRenewalRequest.userId} is not currently borrowing media item ${mediaRenewalRequest.mediaId}`))
            } else {
                await this.verifyRenewalLimitIsNotExceeded(mediaBorrowingRecord.renewals, result)
                this.validateRenewedEndDate(mediaBorrowingRecord.endDate, mediaRenewalRequest.renewedEndDate, result)

                if (!result.hasErrors()) {
                    mediaBorrowingRecord.endDate = mediaRenewalRequest.renewedEndDate
                    mediaBorrowingRecord.renewals += 1
                    mediaBorrowingRepository.updateBorrowingRecord(mediaBorrowingRecord)
                    result.value = true
                }
            }

            this.dbContext.commit()
        } catch (e) {
            result.addError(e as Error)
            this.dbContext.rollback()
        } finally {
            return result
        }
    }

    private async verifyRenewalLimitIsNotExceeded(renewals : number, result : Message<boolean>) {
        const mediaBorrowingConfigRepository = await this.dbContext.getMediaBorrowingConfigRepository()
        const renewalsLimitResult = await mediaBorrowingConfigRepository.getRenewalLimit()
        const renewalsLimit = renewalsLimitResult.value ?? Container.get(MAX_RENEWALS)

        if (renewals >= renewalsLimit) {
            result.addError(new MaxRenewalsExceededError(`Maximum amount of renewals is ${renewalsLimit}.`))
        }
    }

    private validateRenewedEndDate(currentEnd : Date, renewedEnd : Date, result : Message<boolean>) {
        const dateValidationResult = this.mediaBorrowingDateValidator.validateBorrowingDates(currentEnd, renewedEnd)
        if (!dateValidationResult.value) {
            if (dateValidationResult.hasErrors()) {
                for (let error of (dateValidationResult.errors)) {
                    result.addError(error)
                }
            } else {
                result.addError(new InvalidBorrowingDateError(`Renewal date could not be validated.`))
            }
        }
    }
}