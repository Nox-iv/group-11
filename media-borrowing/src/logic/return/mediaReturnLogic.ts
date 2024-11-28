import { Inject } from "typedi";
import { IMediaReturnLogic } from "../../interfaces/logic/return/IMediaReturnLogic";
import { IDbContext } from "../../interfaces/data/uow";
import { Message } from "../../interfaces/messaging/Message";
import { InvalidBorrowingRecordError } from "../errors";
import { IMediaBorrowingRepository, IMediaRepository } from "../../interfaces/data/repositories";
import { MediaBorrowingRecord } from "../../interfaces/dto";
import { MediaItem } from "../../interfaces/dto/MediaItem";

export class MediaReturnLogic extends IMediaReturnLogic {
    private mediaBorrowingRepository : IMediaBorrowingRepository | null
    private mediaRepository : IMediaRepository | null

    constructor (@Inject() dbContext : IDbContext) {
        super()
        this.dbContext = dbContext
        this.mediaBorrowingRepository = null
        this.mediaRepository = null
    }

    public async returnMediaItem(mediaBorrowingRecordId : number) : Promise<Message<boolean>> {
        const result = new Message(false)

        try {
            const mediaBorrowingRepository = await this.getMediaBorrowingRepository()
            const mediaBorrowingRecordResult = await mediaBorrowingRepository.getBorrowingRecordById(mediaBorrowingRecordId)

            if (mediaBorrowingRecordResult.hasErrors()) {
                result.addErrorsFromMessage(mediaBorrowingRecordResult)
            } else if (mediaBorrowingRecordResult.value == null) {
                result.addError(new InvalidBorrowingRecordError(`Media borrowing record ${mediaBorrowingRecordId} does not exist.`))
            } else {
                await this.archiveMediaBorrowingRecord(mediaBorrowingRecordId, result)
                await this.incrementMediaItemAvailability(mediaBorrowingRecordResult.value, result)
            }

            if (!result.hasErrors()) {
                result.value = true
                this.dbContext.commit()
            } else {
                this.dbContext.rollback()
            }

        } catch (e) {
            result.addError(e as Error)
            this.dbContext.rollback()
        } finally {
            return result
        }
    }

    private async getMediaBorrowingRepository() : Promise<IMediaBorrowingRepository> {
        if (this.mediaBorrowingRepository == null) {
            this.mediaBorrowingRepository = await this.dbContext.getMediaBorrowingRepository()
        }

        return this.mediaBorrowingRepository
    }

    private async getMediaRepository() : Promise<IMediaRepository> {
        if (this.mediaRepository == null) {
            this.mediaRepository = await this.dbContext.getMediaRepository()
        }

        return this.mediaRepository
    }

    private async archiveMediaBorrowingRecord(mediaBorrowingRecordId : number, result : Message<boolean>) : Promise<void> {
        const mediaBorrowingRepository = await this.getMediaBorrowingRepository()
        const archivedResult = await mediaBorrowingRepository.archiveBorrowingRecord(mediaBorrowingRecordId)

        if (archivedResult.hasErrors()) {
            archivedResult.addErrorsFromMessage(archivedResult)
        } else if (archivedResult.value == false) {
            archivedResult.addError(new Error(`Could not archive media borrowing record ${mediaBorrowingRecordId}`))
        }
    }

    private async incrementMediaItemAvailability(mediaBorrowingRecord : MediaBorrowingRecord, result : Message<boolean>) : Promise<void> {
        const mediaItemResult = await this.getMediaItem(mediaBorrowingRecord.mediaId, mediaBorrowingRecord.branchId)

        if (mediaItemResult.hasErrors()) {
            result.addErrorsFromMessage(mediaItemResult)
        } else if (mediaItemResult.value == null) {
            result.addError(new Error(`Media item ${mediaBorrowingRecord.mediaId} at branch ${mediaBorrowingRecord.branchId} could not be found.`))
        } else {
            const mediaItem = mediaItemResult.value
            const mediaRepository = await this.getMediaRepository()

            mediaItem.availability += 1

            const updateResult = await mediaRepository.updateMediaItem(mediaItem)
            if (updateResult.hasErrors()) {
                result.addErrorsFromMessage(updateResult)
            } else if (updateResult.value == false) {
                result.addError(new Error(`Media item ${mediaBorrowingRecord.mediaId} at branch ${mediaBorrowingRecord.branchId} could not be updated.`))
            } 
        }
    }

    private async getMediaItem(mediaId : number, branchId : number) : Promise<Message<MediaItem>> {
        const mediaRepository = await this.getMediaRepository()
        const mediaItemResult = await mediaRepository.getByMediaAndBranchId(mediaId, branchId)

        return mediaItemResult
    }
}