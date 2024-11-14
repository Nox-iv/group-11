import { Service } from "typedi";
import { MediaInventoryRepository } from "../../../data/inventory";

@Service()
export class FakeMediaInventoryRepository extends MediaInventoryRepository{
    private isValidMediaItem: boolean
    private mediaItemIsAvailable: boolean

    constructor() {
        super()
        this.isValidMediaItem = true
        this.mediaItemIsAvailable = true
    }

    updateMediaAvailability(mediaItemId: number): void {
        // Check inventory
        // Update inventory with lock
        // Handle error codes
        if (!this.isValidMediaItem) {
            throw Error('Media item could not be found.')
        }

        if (!this.mediaItemIsAvailable) {
            throw Error('Media item is not available.')
        }
    }

    setIsValidMediaItem(valid: boolean) {
        this.isValidMediaItem = valid
    }

    setMediaItemIsAvailable(available: boolean) {
        this.mediaItemIsAvailable = available
    }
} 