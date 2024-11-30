import { IMediaRenewalLogic } from "../../interfaces/logic/mediaRenewals/IMediaRenewalLogic";
import { Message } from "../../../shared/messaging/Message";
import { Inject } from "typedi";
import { IDbContext } from "../../../db/interfaces/dbContext";
import { InvalidBorrowingDateError } from "../mediaBorrowingDateValidation";
import { MaxRenewalsExceededError } from "../mediaBorrowingConfig";
import { InvalidBorrowingRecordError } from "../mediaBorrowing";
import { MediaRenewalRequest } from "./dto/MediaRenewalRequest";
import { IMediaBorrowingDateValidator } from "../../interfaces/logic/mediaBorrowingDateValidation/IMediaBorrowingDateValidator";
import { BorrowingDateValidationRequest } from "../mediaBorrowingDateValidation/dto/BorrowingDateValidationRequest";

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

            const mediaBorrowingRecordResult = await mediaBorrowingRepository.getBorrowingRecordById(mediaRenewalRequest.mediaBorrowingRecordId)
            const mediaBorrowingRecord = mediaBorrowingRecordResult.value
    
            if (mediaBorrowingRecord == null) {
                result.addError(new InvalidBorrowingRecordError(`Media Borrowing Record ${mediaRenewalRequest.mediaBorrowingRecordId} does not exist.`))
            } else {
                await this.verifyRenewalLimitIsNotExceeded(mediaBorrowingRecord.renewals, mediaBorrowingRecord.branchId, result)

                const borrowingDateValidationRequest : BorrowingDateValidationRequest = {
                    startDate : mediaBorrowingRecord.endDate,
                    endDate : mediaRenewalRequest.renewedEndDate,
                    branchId : mediaBorrowingRecord.branchId
                }

                await this.validateRenewedEndDate(borrowingDateValidationRequest, result)

                if (!result.hasErrors()) {
                    mediaBorrowingRecord.endDate = mediaRenewalRequest.renewedEndDate
                    mediaBorrowingRecord.renewals += 1
                    mediaBorrowingRepository.updateBorrowingRecord(mediaBorrowingRecord)
                    result.value = true
                    this.dbContext.commit()
                } else {
                    this.dbContext.rollback()
                }
            }

        } catch (e) {
            result.addError(e as Error)
            this.dbContext.rollback()
        } finally {
            return result
        }
    }

    private async verifyRenewalLimitIsNotExceeded(renewals : number, branchId : number, result : Message<boolean>) {
        const mediaBorrowingConfigRepository = await this.dbContext.getMediaBorrowingConfigRepository()
        const renewalsLimitResult = await mediaBorrowingConfigRepository.getRenewalLimit(branchId)
        const renewalsLimit = renewalsLimitResult.value

        if (renewalsLimit == null) {
            result.addError(new Error(`Could not retrieve media borrowing config : max renewals.`))
        }
        else if (renewals >= renewalsLimit) {
            result.addError(new MaxRenewalsExceededError(`Maximum amount of renewals is ${renewalsLimit}.`))
        }
    }

    private async validateRenewedEndDate(borrowingDateValidationRequest : BorrowingDateValidationRequest, result : Message<boolean>) {
        const dateValidationResult = await this.mediaBorrowingDateValidator.validateBorrowingDates(borrowingDateValidationRequest)
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