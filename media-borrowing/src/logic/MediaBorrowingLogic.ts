import { Message } from "../interfaces/messaging/Message";
import { MediaBorrowingRecord } from "../interfaces/dto";
import { IMediaBorrowingLogic } from "../interfaces/logic/IMediaBorrowingLogic";
import { InvalidBorrowingDateError } from "./errors/invalidBorrowingDateError";
import { IDbContext } from "../interfaces/data/uow";
import { Inject } from "typedi";
import { InvalidUserError } from "./errors/invalidUserError";
import { InvalidMediaError } from "./errors/invalidMediaError";
import { InvalidBorrowingRecordError } from "./errors/invalidBorrowingRecordError";
import { IMediaBorrowingRepository } from "../interfaces/data/repositories";

export class MediaBorrowingLogic extends IMediaBorrowingLogic {

    constructor(@Inject() dbContext : IDbContext) {
        super()
        this.dbContext = dbContext
    }

    public async BorrowMediaItem(mediaBorrowingRecord : MediaBorrowingRecord) : Promise<Message<boolean>> {
        const result = new Message(false)

        try {
            const mediaBorrowingRepository = await this.dbContext.getMediaBorrowingRepository()

            this.validateBorrowingDates(mediaBorrowingRecord.startDate, mediaBorrowingRecord.endDate, result)
            await this.validateUserId(mediaBorrowingRecord.userId, result)
            await this.validateMediaId(mediaBorrowingRecord.mediaId, result)
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

    private async validateBorrowingDates(startDate : Date, endDate : Date, result : Message<boolean>) {
        const earliestEndDate = this.getEarliestEndDate(startDate)
        if (endDate < earliestEndDate) {
            result.addError(new InvalidBorrowingDateError(`Earliest possible end date for the given start date is ${earliestEndDate}`))
        }
    }

    private async validateUserId(userId : number, result : Message<boolean>) {
        const userRepository = await this.dbContext.getUserRepository()
        const hasUserResult = await userRepository.hasUser(userId)
        
        if (!hasUserResult.value) {
            result.addError(new InvalidUserError(`User ${userId} does not exist.`))
        }
    }

    private async validateMediaId(mediaId: number, result : Message<boolean>) {
        const mediaRepository = await this.dbContext.getMediaRepository()
        const hasMediaResult = await mediaRepository.hasMedia(mediaId)

        if (!hasMediaResult.value) {
            result.addError(new InvalidMediaError(`Media item ${mediaId} does not exist.`))
        }
    }

    private async rejectIfUserIsAlreadyBorrowingMediaItem(userId: number, mediaId: number, mediaBorrowingRepository : IMediaBorrowingRepository, result: Message<boolean>) {
        const hasBorrowingRecordResult = await mediaBorrowingRepository.hasBorrowingRecord(userId, mediaId)

        if (hasBorrowingRecordResult.value) {
            result.addError(new InvalidBorrowingRecordError(`User ${userId} is already borrowing media item ${mediaId}`))
        }
    }

    private getEarliestEndDate(startDate: Date) : Date {
        const earliestEndDate = new Date(startDate)
        earliestEndDate.setDate(earliestEndDate.getDate() + 1)

        return earliestEndDate
    }
}