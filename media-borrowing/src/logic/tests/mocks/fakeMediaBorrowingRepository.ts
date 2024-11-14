import { Service } from "typedi";
import { MediaBorrowingRepository } from "../../../data/borrowing";

@Service()
export class FakeMediaBorrowingRepository extends MediaBorrowingRepository{
    private borrowingRecordExists : boolean

    constructor() {
        super()
        this.borrowingRecordExists = false
    }

    insertBorrowingRecord(mediaItemId: number): void {
        if (this.borrowingRecordExists) {
            throw Error('A customer can only borrow one copy of a media item.')
        } else {
            this.borrowingRecordExists = true
        }
    }

    setRecordExists(exists: boolean) {
        this.borrowingRecordExists = exists
    }

    hasRecordBeenInserted() {
        return this.borrowingRecordExists
    }
} 