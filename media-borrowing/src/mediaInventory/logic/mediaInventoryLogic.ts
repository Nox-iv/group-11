import { Inject } from "typedi"
import { Message } from "../../shared/messaging/Message"
import { MediaInventoryRecord } from "../data/models"
import { IMediaInventoryLogic } from "../interfaces/logic/IMediaInventoryLogic"
import { IDbContext } from "../../db/interfaces/dbContext"
import { InvalidMediaError } from "./errors/invalidMediaError"

export class MediaInventoryLogic extends IMediaInventoryLogic {
    constructor(@Inject() dbContext : IDbContext) {
        super()
        this.dbContext = dbContext
    }

    public async isMediaItemAvailableAtBranch(mediaId : number, branchId : number) : Promise<Message<boolean>> {
        const result = new Message(false)

        try {
            const mediaItem = await this.getMediaItem(mediaId, branchId)

            if (mediaItem.availability > 0) {
                result.value = true
            }

            this.dbContext.commit()
        } catch(e) {
            result.addError(e as Error)
            result.value = false
            this.dbContext.rollback()
        } finally {
            return result
        }
    }

    public async incrementMediaItemAvailabilityAtBranch(mediaId : number, branchId : number) : Promise<Message<boolean>> {
        const result = new Message(false)

        try {
            const mediaItem = await this.getMediaItem(mediaId, branchId)

            mediaItem.availability += 1
            await this.updateMediaItem(mediaItem)

            if (!result.hasErrors()) {
                result.value = true
                this.dbContext.commit()
            } else {
                this.dbContext.rollback()
            } 
        } catch(e) {
            result.addError(e as Error)
            result.value = false
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
            await this.updateMediaItem(mediaItem)

            if (!result.hasErrors()) {
                result.value = true
                this.dbContext.commit()
            } else {
                this.dbContext.rollback()
            } 
        } catch(e) {
            result.addError(e as Error)
            result.value = false
            this.dbContext.rollback()
        } finally {
            return result
        }
    }

    private async getMediaItem(mediaId : number, branchId : number) : Promise<MediaInventoryRecord> {
        const mediaInventoryRepository = await this.dbContext.getMediaInventoryRepository()
        const mediaItem = await mediaInventoryRepository.getInventoryByMediaAndBranchId(mediaId, branchId)

        if (mediaItem != null) {
            return mediaItem
        } else {
            throw new InvalidMediaError(`Media item ${mediaId} could not be found at branch ${branchId}`)
        }
    }

    private async updateMediaItem(mediaInventoryRecord : MediaInventoryRecord) {
        const mediaInventoryRepository = await this.dbContext.getMediaInventoryRepository()
        await mediaInventoryRepository.updateMediaItemAvailability(mediaInventoryRecord)
    }
 }