import { IMediaRenewalLogic } from "../../interfaces/logic/mediaRenewals/IMediaRenewalLogic";
import { Message } from "../../../shared/messaging/Message";
import { IDbContext, IDbContextFactory } from "../../../db/interfaces/dbContext";
import { InvalidBorrowingDateError } from "../mediaBorrowingDateValidation";
import { MaxRenewalsExceededError } from "../mediaBorrowingConfig";
import { InvalidBorrowingRecordError } from "../mediaBorrowing";
import { MediaRenewalRequest } from "./dto/MediaRenewalRequest";
import { IMediaBorrowingDateValidator } from "../../interfaces/logic/mediaBorrowingDateValidation/IMediaBorrowingDateValidator";
import { BorrowingDateValidationRequest } from "../mediaBorrowingDateValidation/dto/BorrowingDateValidationRequest";

export class MediaRenewalLogic extends IMediaRenewalLogic {
    constructor(
        dbContextFactory : IDbContextFactory,
        mediaBorrowingDateValidator : IMediaBorrowingDateValidator
    ) {
        super()
        this.dbContextFactory = dbContextFactory
        this.mediaBorrowingDateValidator = mediaBorrowingDateValidator
    }

    public async renewMediaItem(mediaRenewalRequest : MediaRenewalRequest) : Promise<Message<boolean>> {
        const result = new Message(false)
        const dbContext = await this.dbContextFactory.create()

        try {
            const mediaBorrowingRepository = await dbContext.getMediaBorrowingRepository()

            const mediaBorrowingRecord = await mediaBorrowingRepository.getMediaBorrowingRecordById(mediaRenewalRequest.mediaBorrowingRecordId)
            if (mediaBorrowingRecord == null) {
                result.addError(new InvalidBorrowingRecordError(`Media Borrowing Record ${mediaRenewalRequest.mediaBorrowingRecordId} does not exist.`))
                await dbContext.rollback()
            } else {
                await this.verifyRenewalLimitIsNotExceeded(mediaBorrowingRecord.renewals, mediaBorrowingRecord.branchId, dbContext, result)

                const borrowingDateValidationRequest : BorrowingDateValidationRequest = {
                    startDate : mediaBorrowingRecord.endDate,
                    endDate : mediaRenewalRequest.renewedEndDate,
                    branchId : mediaBorrowingRecord.branchId
                }

                await this.validateRenewedEndDate(borrowingDateValidationRequest, result)

                if (!result.hasErrors()) {
                    mediaBorrowingRecord.endDate = mediaRenewalRequest.renewedEndDate
                    mediaBorrowingRecord.renewals += 1

                    await mediaBorrowingRepository.updateMediaBorrowingRecord(mediaBorrowingRecord)
                    
                    result.value = true
                    await dbContext.commit()
                } else {
                    await dbContext.rollback()
                }    
            }
        } catch (e) {
            result.addError(e as Error)
            await dbContext.rollback()
        } finally {
            return result
        }
    }

    private async verifyRenewalLimitIsNotExceeded(renewals : number, branchId : number, dbContext : IDbContext, result : Message<boolean>) {
        const mediaBorrowingConfigRepository = await dbContext.getMediaBorrowingConfigRepository()
        const renewalsLimit = await mediaBorrowingConfigRepository.getRenewalLimit(branchId)

        if (renewalsLimit == null) {
            result.addError(new Error(`Could not retrieve media borrowing config : max renewals.`))
        } else if (renewals >= renewalsLimit) {
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