import { Inject } from "typedi";
import { IMediaReturnLogic } from "../../interfaces/logic/mediaReturns/IMediaReturnLogic";
import { IDbContext } from "../../../db/interfaces/dbContext";
import { Message } from "../../../shared/messaging/Message";
import { InvalidBorrowingRecordError } from "../mediaBorrowing";
import { MediaBorrowingRecord } from "../../data/models";
import { MediaItem } from "../../../mediaInventory/data/models/MediaItem";

export class MediaReturnLogic extends IMediaReturnLogic {
    constructor (@Inject() dbContext : IDbContext) {
        super()
        this.dbContext = dbContext
    }

    public async returnMediaItem(mediaBorrowingRecordId : number) : Promise<Message<boolean>> {
        const result = new Message(false)

        try {
            const mediaBorrowingRepository = await this.dbContext.getMediaBorrowingRepository()
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

    private async archiveMediaBorrowingRecord(mediaBorrowingRecordId : number, result : Message<boolean>) : Promise<void> {
        const mediaBorrowingRepository = await this.dbContext.getMediaBorrowingRepository()
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
            const mediaRepository = await this.dbContext.getMediaRepository()

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
        const mediaRepository = await this.dbContext.getMediaRepository()
        const mediaItemResult = await mediaRepository.getByMediaAndBranchId(mediaId, branchId)

        return mediaItemResult
    }
}