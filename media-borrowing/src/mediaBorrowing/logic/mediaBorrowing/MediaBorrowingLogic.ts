import { Message } from "../../../shared/messaging/Message";
import { MediaBorrowingRecord } from "../../data/models";
import { IMediaBorrowingLogic } from "../../interfaces/logic/mediaBorrowing/IMediaBorrowingLogic";
import { IDbContext } from "../../../db/interfaces/dbContext";
import { Inject } from "typedi";
import { InvalidUserError } from "../../../amlUsers/logic/errors/invalidUserError";
import { InvalidBorrowingRecordError } from "./errors/invalidBorrowingRecordError";
import { IMediaBorrowingDateValidator } from "../../interfaces/logic/mediaBorrowingDateValidation/IMediaBorrowingDateValidator";
import { UnavailableMediaItemError } from "./errors/unavailableMediaItemError";
import { IMediaInventoryLogic } from "../../../mediaInventory/interfaces/logic/IMediaInventoryLogic";
import { IUserEligibilityLogic } from "../../../amlUsers/interfaces/logic/IUserEligibilityLogic";

export class MediaBorrowingLogic extends IMediaBorrowingLogic {
    constructor(
        @Inject() dbContext : IDbContext,
        @Inject() userEligibilityLogic : IUserEligibilityLogic,
        @Inject() mediaInventoryLogic : IMediaInventoryLogic,
        @Inject() mediaBorrowingDateValidator : IMediaBorrowingDateValidator
    ) {
        super()
        this.dbContext = dbContext
        this.mediaInventoryLogic = mediaInventoryLogic
        this.mediaBorrowingDateValidator = mediaBorrowingDateValidator
        this.userEligibilityLogic = userEligibilityLogic
    }

    public async BorrowMediaItem(mediaBorrowingRecord : MediaBorrowingRecord) : Promise<Message<boolean>> {
        const result = new Message(false)

        try {
            const mediaBorrowingRepository = await this.dbContext.getMediaBorrowingRepository()

            await this.validateUserEligibility(mediaBorrowingRecord, result)
            await this.verifyMediaItemIsAvailable(mediaBorrowingRecord.mediaId, mediaBorrowingRecord.branchId, result)
            await this.validateBorrowingDates(mediaBorrowingRecord.startDate, mediaBorrowingRecord.endDate, mediaBorrowingRecord.branchId, result)
            await this.rejectIfUserIsAlreadyBorrowingMediaItem(mediaBorrowingRecord, result)
    
            if (!result.hasErrors()) {
                mediaBorrowingRecord.renewals = 0
                await mediaBorrowingRepository.insertMediaBorrowingRecord(mediaBorrowingRecord)
                await this.mediaInventoryLogic.decrementMediaItemAvailabilityAtBranch(mediaBorrowingRecord.mediaId, mediaBorrowingRecord.branchId)
                this.dbContext.commit()
                result.value = true
            } else {
                this.dbContext.rollback()
            }
        } catch(e) {
            result.addError(e as Error)
            this.dbContext.rollback()
            result.value = false
        } finally {
            return result
        }
    }

    private async verifyMediaItemIsAvailable(mediaId: number, branchId : number, result : Message<boolean>) {
        const isMediaItemAvailableResult = await this.mediaInventoryLogic.isMediaItemAvailableAtBranch(mediaId, branchId)

        if (isMediaItemAvailableResult.hasErrors()) {
            result.addErrorsFromMessage(isMediaItemAvailableResult)
        }

        if (isMediaItemAvailableResult.value != null && !isMediaItemAvailableResult.value) {
            result.addError(new UnavailableMediaItemError(`Media item ${mediaId} is currently unavailable at branch ${branchId}`))
        }
    }

    private async validateBorrowingDates(startDate : Date, endDate : Date, branchId: number ,result : Message<boolean>) {
        const validationResult = await this.mediaBorrowingDateValidator.validateBorrowingDates({startDate, endDate, branchId})
        if (validationResult.hasErrors()) {
            for(let error of validationResult.errors) {
                result.addError(error)
            }
        }
    }

    private async validateUserEligibility(mediaBorrowingRecord : MediaBorrowingRecord, result : Message<boolean>) {
        const { userId, mediaId, branchId } = mediaBorrowingRecord
        const userEligibilityResult = await this.userEligibilityLogic.isUserEligibleToBorrowMediaItemAtBranch(userId, mediaId, branchId)
        
        if (!userEligibilityResult.value) {
            result.addError(new InvalidUserError(`User ${userId} is not eligible to borrow media item ${mediaId} from branch ${branchId}.`))
        }

        if (userEligibilityResult.hasErrors()) {
            result.addErrorsFromMessage(userEligibilityResult)
        }
    }

    private async rejectIfUserIsAlreadyBorrowingMediaItem(mediaBorrowingRecord : MediaBorrowingRecord, result: Message<boolean>) {
        const {userId, mediaId, branchId} = mediaBorrowingRecord
        const mediaBorrowingRepository = await this.dbContext.getMediaBorrowingRepository()

        if (await mediaBorrowingRepository.hasMediaBorrowingRecord(userId, mediaId, branchId)) {
            result.addError(new InvalidBorrowingRecordError(`User ${userId} is already borrowing media item ${mediaId}`))
        }
    }
}