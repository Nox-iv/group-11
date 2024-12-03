import { IMediaReturnLogic } from "../../interfaces/logic/mediaReturns/IMediaReturnLogic";
import { IDbContextFactory } from "../../../db/interfaces/dbContext";
import { Message } from "../../../shared/messaging/Message";
import { InvalidBorrowingRecordError } from "../mediaBorrowing";
import { IMediaInventoryLogic } from "../../../mediaInventory/interfaces/logic/IMediaInventoryLogic";
import { Inject } from "typedi";

export class MediaReturnLogic extends IMediaReturnLogic {
    constructor (
        @Inject() dbContextFactory : IDbContextFactory,
        @Inject() mediaInventoryLogic : IMediaInventoryLogic
    ) {
        super()
        this.dbContextFactory = dbContextFactory
        this.mediaInventoryLogic = mediaInventoryLogic
    }

    public async returnMediaItem(mediaBorrowingRecordId : number) : Promise<Message<boolean>> {
        const result = new Message(false)
        const dbContext = await this.dbContextFactory.create()

        try {
            const mediaBorrowingRepository = await dbContext.getMediaBorrowingRepository()
            const mediaBorrowingRecord = await mediaBorrowingRepository.getMediaBorrowingRecordById(mediaBorrowingRecordId)

            if (mediaBorrowingRecord == null) {
                result.addError(new InvalidBorrowingRecordError(`Media borrowing record ${mediaBorrowingRecordId} does not exist.`)) 
            } else {
                await mediaBorrowingRepository.archiveMediaBorrowingRecord(mediaBorrowingRecordId)
                await this.updateMediaItemAvailability(mediaBorrowingRecord.mediaId, mediaBorrowingRecord.branchId, result)
            }

            if (!result.hasErrors()) {
                result.value = true
                await dbContext.commit()
            } else {
                await dbContext.rollback()
            }

        } catch (e) {
            result.addError(e as Error)
            await dbContext.rollback()
        } finally {
            return result
        }
    }

    private async updateMediaItemAvailability(mediaId : number, branchId : number, result : Message<boolean>) : Promise<void> {
        const updateResult = await this.mediaInventoryLogic.incrementMediaItemAvailabilityAtBranch(mediaId, branchId)

        if (updateResult.hasErrors()) {
            result.addErrorsFromMessage(updateResult)
        }
    }   
 }