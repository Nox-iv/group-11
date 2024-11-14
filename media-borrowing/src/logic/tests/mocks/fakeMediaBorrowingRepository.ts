import { Service } from "typedi";
import { MediaBorrowingRepository } from "../../../data/borrowing";

@Service()
export class FakeMediaBorrowingRepository extends MediaBorrowingRepository{
    private borrowingRecordAlreadyExists : boolean

    constructor() {
        super()
        this.borrowingRecordAlreadyExists = true
    }

    updateMediaAvailability(mediaItemId: number): void {
        // Check inventory
        // Update inventory with lock
        // Handle error codes
        if (this.borrowingRecordAlreadyExists) {
            throw Error('A customer can only borrow one copy of a media item.')
        }
    }

    setRecordExists(exists: boolean) {
        this.borrowingRecordAlreadyExists = exists
    }
} 