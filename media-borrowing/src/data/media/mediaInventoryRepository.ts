import { Service } from "typedi";

@Service()
export class MediaInventoryRepository {
    constructor() {}

    updateMediaAvailability(mediaItemId: number): number {
        return 0
    }
}

// Check lock
// 