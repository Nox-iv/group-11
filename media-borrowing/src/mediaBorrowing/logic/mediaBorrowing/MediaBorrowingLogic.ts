import { Message } from "../../../shared/messaging/Message";
import { MediaBorrowingRecord } from "../../data/models";
import { IMediaBorrowingLogic } from "../../interfaces/logic/mediaBorrowing/IMediaBorrowingLogic";
import { IDbContext } from "../../../db/interfaces/dbContext";
import { Inject } from "typedi";
import { InvalidUserError } from "../../../amlUsers/invalidUserError";
import { InvalidBorrowingRecordError } from "./errors/invalidBorrowingRecordError";
import { IMediaBorrowingDateValidator } from "../../interfaces/logic/mediaBorrowingDateValidation/IMediaBorrowingDateValidator";
import { UnavailableMediaItemError } from "./errors/unavailableMediaItemError";
import { IMediaInventoryLogic } from "../../../mediaInventory/interfaces/logic/IMediaInventoryLogic";

export class MediaBorrowingLogic extends IMediaBorrowingLogic {
    constructor(
        @Inject() dbContext : IDbContext,
        @Inject() mediaInventoryLogic : IMediaInventoryLogic,
        @Inject() mediaBorrowingDateValidator : IMediaBorrowingDateValidator
    ) {
        super()
        this.dbContext = dbContext
        this.mediaInventoryLogic = mediaInventoryLogic
        this.mediaBorrowingDateValidator = mediaBorrowingDateValidator
    }

    public async BorrowMediaItem(mediaBorrowingRecord : MediaBorrowingRecord) : Promise<Message<boolean>> {
        const result = new Message(false)

        try {
            const mediaBorrowingRepository = await this.dbContext.getMediaBorrowingRepository()

            await this.validateUserId(mediaBorrowingRecord.userId, result)
            await this.verifyMediaItemIsAvailable(mediaBorrowingRecord.mediaId, mediaBorrowingRecord.branchId, result)
            await this.validateBorrowingDates(mediaBorrowingRecord.startDate, mediaBorrowingRecord.endDate, mediaBorrowingRecord.branchId, result)
            await this.rejectIfUserIsAlreadyBorrowingMediaItem(mediaBorrowingRecord, result)
    
            if (!result.hasErrors()) {
                await mediaBorrowingRepository.insertBorrowingRecord(mediaBorrowingRecord)
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

    private async validateUserId(userId : number, result : Message<boolean>) {
        const userRepository = await this.dbContext.getUserRepository()
        const hasUserResult = await userRepository.hasUser(userId)
        
        if (!hasUserResult.value) {
            result.addError(new InvalidUserError(`User ${userId} does not exist.`))
        }
    }

    private async rejectIfUserIsAlreadyBorrowingMediaItem(mediaBorrowingRecord : MediaBorrowingRecord, result: Message<boolean>) {
        const {userId, mediaId, branchId} = mediaBorrowingRecord
        const mediaBorrowingRepository = await this.dbContext.getMediaBorrowingRepository()
        const hasBorrowingRecordResult = await mediaBorrowingRepository.checkBorrowingRecordExists(userId, mediaId, branchId)

        if (hasBorrowingRecordResult.value) {
            result.addError(new InvalidBorrowingRecordError(`User ${userId} is already borrowing media item ${mediaId}`))
        }
    }
}