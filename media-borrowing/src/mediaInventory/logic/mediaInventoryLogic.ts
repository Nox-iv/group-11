import { Inject } from "typedi"
import { Message } from "../../shared/messaging/Message"
import { MediaItem } from "../data/models"
import { IMediaInventoryLogic } from "../interfaces/logic/IMediaInventoryLogic"
import { IDbContext } from "../../db/interfaces/dbContext"
import { InvalidMediaError } from "./errors/invalidMediaError"

export class MediaInventoryLogic extends IMediaInventoryLogic {
    constructor(@Inject() dbContext : IDbContext) {
        super()
        this.dbContext = dbContext
    }

    public async isMediaItemAvailableAtBranch(mediaId : number, branchId : number) : Promise<Message<boolean>> {
        return new Message(true)
    }

    public async incrementMediaItemAvailabilityAtBranch(mediaId : number, branchId : number) : Promise<Message<boolean>> {
        const result = new Message(false)

        try {
            const mediaItem = await this.getMediaItem(mediaId, branchId)

            mediaItem.availability += 1
            await this.updateMediaItem(mediaItem, result)

            if (!result.hasErrors()) {
                result.value = true
                this.dbContext.commit()
            } else {
                this.dbContext.rollback()
            } 
        } catch(e) {
            result.addError(e as Error)
            this.dbContext.rollback()
        } finally {
            return result
        }
    }

    public async decrementMediaItemAvailabilityAtBranch(mediaId : number, branchId : number) : Promise<Message<boolean>> {
        const result = new Message(false)

        try {
            const mediaItem = await this.getMediaItem(mediaId, branchId)

            mediaItem.availability -= 1
            await this.updateMediaItem(mediaItem, result)

            if (!result.hasErrors()) {
                result.value = true
                this.dbContext.commit()
            } else {
                this.dbContext.rollback()
            } 
        } catch(e) {
            result.addError(e as Error)
            this.dbContext.rollback()
        } finally {
            return result
        }
    }

    private async getMediaItem(mediaId : number, branchId : number) : Promise<MediaItem> {
        const mediaRepository = await this.dbContext.getMediaRepository()
        const mediaItemResult = await mediaRepository.getByMediaAndBranchId(mediaId, branchId)

        if (mediaItemResult.value != null) {
            return mediaItemResult.value
        } else {
            throw new InvalidMediaError(`Media item ${mediaId} could not be found at branch ${branchId}`)
        }
    }

    private async updateMediaItem(mediaItem : MediaItem, result : Message<boolean>) {
        const mediaRepository = await this.dbContext.getMediaRepository()
        const updateResult = await mediaRepository.updateMediaItem(mediaItem)

        if (updateResult.hasErrors()) {
            result.addErrorsFromMessage(updateResult)
        } else if (updateResult.value == false) {
            result.addError(new Error(`Media item ${mediaItem.mediaId} at branch ${mediaItem.branchId} could not be updated.`))
        }
    }
 }