import { IMediaReturnLogic } from "../../interfaces/logic/mediaReturns/IMediaReturnLogic";
import { IDbContext } from "../../../db/interfaces/dbContext";
import { Message } from "../../../shared/messaging/Message";
import { InvalidBorrowingRecordError } from "../mediaBorrowing";
import { IMediaInventoryLogic } from "../../../mediaInventory/interfaces/logic/IMediaInventoryLogic";

export class MediaReturnLogic extends IMediaReturnLogic {
    constructor (
        dbContext : IDbContext,
        mediaInventoryLogic : IMediaInventoryLogic
    ) {
        super()
        this.dbContext = dbContext
        this.mediaInventoryLogic = mediaInventoryLogic
    }

    public async returnMediaItem(mediaBorrowingRecordId : number) : Promise<Message<boolean>> {
        const result = new Message(false)

        try {
            const mediaBorrowingRepository = await this.dbContext.getMediaBorrowingRepository()
            const mediaBorrowingRecordResult = await mediaBorrowingRepository.getBorrowingRecordById(mediaBorrowingRecordId)

            if (mediaBorrowingRecordResult.hasErrors()) {
                result.addErrorsFromMessage(mediaBorrowingRecordResult)
            } 

            if (mediaBorrowingRecordResult.value == null) {
                result.addError(new InvalidBorrowingRecordError(`Media borrowing record ${mediaBorrowingRecordId} does not exist.`)) 
            } 
            
            if (mediaBorrowingRecordResult.value != null && !mediaBorrowingRecordResult.hasErrors()) {
                const {mediaId, branchId} = mediaBorrowingRecordResult.value

                await this.archiveMediaBorrowingRecord(mediaBorrowingRecordId, result)
                await this.updateMediaItemAvailability(mediaId, branchId, result)
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

    private async updateMediaItemAvailability(mediaId : number, branchId : number, result : Message<boolean>) : Promise<void> {
        const updateResult = await this.mediaInventoryLogic.incrementMediaItemAvailabilityAtBranch(mediaId, branchId)

        if (updateResult.hasErrors()) {
            result.addErrorsFromMessage(updateResult)
        }
    }   
 }