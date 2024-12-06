import { IMediaBorrowingReader } from "../interfaces/logic/IMediaBorrowingReader"
import { MediaBorrowingRecordListingDetails } from "../data/models"
import { Message } from "../../shared/messaging/Message"
import { IMediaBorrowingReaderRepository } from "../interfaces/data/repositories/IMediaBorrowingReaderRepository"

export class MediaBorrowingReader extends IMediaBorrowingReader {
    constructor(mediaBorrowingReaderRepository : IMediaBorrowingReaderRepository) {
        super()
        this.mediaBorrowingReaderRepository = mediaBorrowingReaderRepository
    }

    public async getMediaBorrowingRecordsByUserId(userId : number, offset : number, limit : number) : Promise<Message<MediaBorrowingRecordListingDetails[]>> {
        const result = new Message<MediaBorrowingRecordListingDetails[]>([])

        try {
            const MediaBorrowingRecordListingDetails = await this.mediaBorrowingReaderRepository.getMediaBorrowingRecordsByUserId(userId, offset, limit)

            if (MediaBorrowingRecordListingDetails != null) {
                result.value = MediaBorrowingRecordListingDetails
            } 
        } catch(e) {
            result.addError(e as Error)
        } finally {
            return result
        }
    }
}