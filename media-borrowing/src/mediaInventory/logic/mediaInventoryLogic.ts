import { Inject } from "typedi"
import { Message } from "../../shared/messaging/Message"
import { MediaInventoryRecord } from "../data/models"
import { IMediaInventoryLogic } from "../interfaces/logic/IMediaInventoryLogic"
import { IDbContext } from "../../db/interfaces/dbContext"
import { InvalidMediaError } from "./errors/invalidMediaError"
import { DbContextFactory } from "../../db/dbContext/dbContextFactory"

export class MediaInventoryLogic extends IMediaInventoryLogic {
    constructor(@Inject() dbContextFactory : DbContextFactory) {
        super()
        this.dbContextFactory = dbContextFactory
    }

    public async isMediaItemAvailableAtBranch(mediaId : number, branchId : number) : Promise<Message<boolean>> {
        const result = new Message(false)
        const dbContext = await this.dbContextFactory.create()

        try {
            const mediaItem = await this.getMediaItem(mediaId, branchId, dbContext)

            if (mediaItem.availability > 0) {
                result.value = true
            }

            await dbContext.commit()
        } catch(e) {
            result.addError(e as Error)
            result.value = false
            await dbContext.rollback()
        } finally {
            return result
        }
    }

    public async incrementMediaItemAvailabilityAtBranch(mediaId : number, branchId : number) : Promise<Message<boolean>> {
        const result = new Message(false)
        const dbContext = await this.dbContextFactory.create()
    
        try {
            const mediaItem = await this.getMediaItem(mediaId, branchId, dbContext)

            mediaItem.availability += 1
            await this.updateMediaItem(mediaItem, dbContext)

            if (!result.hasErrors()) {
                result.value = true
                await dbContext.commit()
            } else {
                await dbContext.rollback()
            } 
        } catch(e) {
            result.addError(e as Error)
            result.value = false
            await dbContext.rollback()
        } finally {
            return result
        }
    }

    public async decrementMediaItemAvailabilityAtBranch(mediaId : number, branchId : number) : Promise<Message<boolean>> {
        const result = new Message(false)
        const dbContext = await this.dbContextFactory.create()
        try {
            const mediaItem = await this.getMediaItem(mediaId, branchId, dbContext)

            mediaItem.availability -= 1
            await this.updateMediaItem(mediaItem, dbContext)

            if (!result.hasErrors()) {
                result.value = true
                await dbContext.commit()
            } else {
                await dbContext.rollback()
            } 
        } catch(e) {
            result.addError(e as Error)
            result.value = false
            await dbContext.rollback()
        } finally {
            return result
        }
    }

    private async getMediaItem(mediaId : number, branchId : number, dbContext : IDbContext) : Promise<MediaInventoryRecord> {
        const mediaInventoryRepository = await dbContext.getMediaInventoryRepository()
        const mediaItem = await mediaInventoryRepository.getInventoryByMediaAndBranchId(mediaId, branchId)

        if (mediaItem != null) {
            return mediaItem
        } else {
            throw new InvalidMediaError(`Media item ${mediaId} could not be found at branch ${branchId}`)
        }
    }

    private async updateMediaItem(mediaInventoryRecord : MediaInventoryRecord, dbContext : IDbContext) {
        const mediaInventoryRepository = await dbContext.getMediaInventoryRepository()
        await mediaInventoryRepository.updateMediaItemAvailability(mediaInventoryRecord)
    }
 }