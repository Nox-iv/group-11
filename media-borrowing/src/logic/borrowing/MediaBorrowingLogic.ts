import { Message } from "../../interfaces/messaging/Message";
import { MediaBorrowingRecord } from "../../interfaces/dto";
import { IMediaBorrowingLogic } from "../../interfaces/logic/borrowing/IMediaBorrowingLogic";
import { InvalidBorrowingDateError } from "../errors/invalidBorrowingDateError";
import { IDbContext } from "../../interfaces/data/uow";
import { Inject } from "typedi";
import { InvalidUserError } from "../errors/invalidUserError";
import { InvalidMediaError } from "../errors/invalidMediaError";
import { InvalidBorrowingRecordError } from "../errors/invalidBorrowingRecordError";
import { IMediaBorrowingRepository } from "../../interfaces/data/repositories";
import { IMediaBorrowingDateValidator } from "../../interfaces/logic/date-validator/IMediaBorrowingDateValidator";
import { UnavailableMediaItemError } from "../errors";


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

            this.validateBorrowingDates(mediaBorrowingRecord.startDate, mediaBorrowingRecord.endDate, result)
            await this.validateUserId(mediaBorrowingRecord.userId, result)
            await this.validateMediaAvailability(mediaBorrowingRecord.mediaId, mediaBorrowingRecord.branchId, result)
            await this.rejectIfUserIsAlreadyBorrowingMediaItem(mediaBorrowingRecord.userId, mediaBorrowingRecord.mediaId, mediaBorrowingRepository, result)
    
            if (!result.hasErrors()) {
                mediaBorrowingRepository.insertBorrowingRecord(mediaBorrowingRecord)
                result.value = true
            }
            
            this.dbContext.commit()
        } catch(e) {
            result.addError(e as Error)
            this.dbContext.rollback()
            result.value = false
        } finally {
            return result
        }
    }

    private validateBorrowingDates(startDate : Date, endDate : Date, result : Message<boolean>) {
        const validationResult = this.mediaBorrowingDateValidator.validateBorrowingDates(startDate, endDate)
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

    private async validateMediaAvailability(mediaId: number, branchId: number, result : Message<boolean>) {
        const mediaRepository = await this.dbContext.getMediaRepository()
        const mediaItemResult = await mediaRepository.getMedia(mediaId, branchId)

        const mediaItem = mediaItemResult.value

        if (mediaItem == null) {
            result.addError(new InvalidMediaError(`Media item with ${mediaId} could not be found.`))
        } else if (mediaItem.availability <= 0) {
            result.addError(new UnavailableMediaItemError(`Media item ${mediaId} is not available at branch ${branchId}`))
        }
    }

    private async rejectIfUserIsAlreadyBorrowingMediaItem(userId: number, mediaId: number, mediaBorrowingRepository : IMediaBorrowingRepository, result: Message<boolean>) {
        const hasBorrowingRecordResult = await mediaBorrowingRepository.hasBorrowingRecord(userId, mediaId)

        if (hasBorrowingRecordResult.value) {
            result.addError(new InvalidBorrowingRecordError(`User ${userId} is already borrowing media item ${mediaId}`))
        }
    }
}