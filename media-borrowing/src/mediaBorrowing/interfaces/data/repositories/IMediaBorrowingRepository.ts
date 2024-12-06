import { MediaBorrowingRecord } from "../../../data/models"
import { NotImplementedError } from "../../../../shared/errors/notImplementedError"

export class IMediaBorrowingRepository {
    public async insertMediaBorrowingRecord(mediaBorrowingRecord : MediaBorrowingRecord): Promise<void> {
        throw new NotImplementedError()
    }

    public updateMediaBorrowingRecord(mediaBorrowingRecord : MediaBorrowingRecord) : Promise<void> {
        throw new NotImplementedError()
    }

    public archiveMediaBorrowingRecord(mediaBorrowingRecordId : number, returnedOn: Date) : Promise<void> {
        throw new NotImplementedError()
    }

    public hasMediaBorrowingRecordForMediaItem(userId : number, mediaId: number) : Promise<boolean> {
        throw new NotImplementedError()
    }

    public getMediaBorrowingRecordById(mediaBorrowingRecordId : number) : Promise<MediaBorrowingRecord | null> {
        throw new NotImplementedError()
    }
}