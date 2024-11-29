import { Message } from "../../interfaces/messaging/Message";
import { MediaBorrowingRecord } from "../../interfaces/dto";
import { IMediaBorrowingLogic } from "../../interfaces/logic/borrowing/IMediaBorrowingLogic";
import { IDbContext } from "../../interfaces/data/uow";
import { Inject } from "typedi";
import { InvalidUserError } from "../errors/invalidUserError";
import { InvalidMediaError } from "../errors/invalidMediaError";
import { InvalidBorrowingRecordError } from "../errors/invalidBorrowingRecordError";
import { MediaItem } from "../../interfaces/dto/MediaItem";
import { IMediaBorrowingDateValidator } from "../../interfaces/logic/date-validator/IMediaBorrowingDateValidator";
import { UnavailableMediaItemError } from "../errors";
import { BorrowingDateValidationRequest } from "../../interfaces/dto/BorrowingDateValidationRequest";
export class MediaBorrowingLogic extends IMediaBorrowingLogic {
    constructor(
        @Inject() dbContext : IDbContext,
        @Inject() mediaBorrowingDateValidator : IMediaBorrowingDateValidator
    ) {
        super()
        this.dbContext = dbContext
        this.mediaBorrowingDateValidator = mediaBorrowingDateValidator
    }

    public async BorrowMediaItem(mediaBorrowingRecord : MediaBorrowingRecord) : Promise<Message<boolean>> {
        const result = new Message(false)

        try {
            const mediaBorrowingRepository = await this.dbContext.getMediaBorrowingRepository()

            await this.validateBorrowingDates(mediaBorrowingRecord.startDate, mediaBorrowingRecord.endDate, mediaBorrowingRecord.branchId, result)

            const mediaItemResult = await this.getMediaItem(mediaBorrowingRecord.mediaId, mediaBorrowingRecord.branchId, result)
            const mediaItem = mediaItemResult.value

            if (mediaItem != null) {
                this.validateMediaAvailability(mediaItem, result)
                await this.validateUserId(mediaBorrowingRecord.userId, result)
                await this.rejectIfUserIsAlreadyBorrowingMediaItem(mediaBorrowingRecord, result)
                await this.decrementMediaItemAvailability(mediaItem, result)
            } else {
                result.addError(new InvalidMediaError(`Media item ${mediaBorrowingRecord.mediaId} does not exist at branch ${mediaBorrowingRecord.branchId}`))
            }
    
            if (!result.hasErrors()) {
                await mediaBorrowingRepository.insertBorrowingRecord(mediaBorrowingRecord)
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

    private async getMediaItem(mediaId : number, branchId : number, result : Message<boolean>) : Promise<Message<MediaItem>> {
        const mediaRepository = await this.dbContext.getMediaRepository()
        const mediaItemResult = await mediaRepository.getByMediaAndBranchId(mediaId, branchId)

        return mediaItemResult
    }

    private validateMediaAvailability(mediaItem : MediaItem, result : Message<boolean>) {
        if (mediaItem.availability <= 0) {
            result.addError(new UnavailableMediaItemError(`Media item ${mediaItem.mediaId} is not available at branch ${mediaItem.branchId}`))
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

    private async decrementMediaItemAvailability(mediaItem : MediaItem, result : Message<boolean>) : Promise<void> {
        const mediaRepository = await this.dbContext.getMediaRepository()

        mediaItem.availability -= 1
        const updateResult = await mediaRepository.updateMediaItem(mediaItem)
        if (updateResult.hasErrors()) {
            result.addErrorsFromMessage(updateResult)
        } else if (updateResult.value == false) {
            result.addError(new Error(`Media item ${mediaItem.mediaId} at branch ${mediaItem.branchId} could not be updated.`))
        }
    }
}