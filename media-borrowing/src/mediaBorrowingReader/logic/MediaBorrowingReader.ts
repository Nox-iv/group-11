import { IMediaBorrowingReader } from "../interfaces/logic/IMediaBorrowingReader"
import { MediaBorrowingRecordDetails } from "../data/models"
import { Message } from "../../shared/messaging/Message"
import { IMediaBorrowingReaderRepository } from "../interfaces/data/repositories/IMediaBorrowingReaderRepository"

export class MediaBorrowingReader extends IMediaBorrowingReader {
    constructor(mediaBorrowingReaderRepository : IMediaBorrowingReaderRepository) {
        super()
        this.mediaBorrowingReaderRepository = mediaBorrowingReaderRepository
    }

    public async getMediaBorrowingRecordsByUserId(userId : number, offset : number, limit : number) : Promise<Message<MediaBorrowingRecordDetails[]>> {
        const result = new Message<MediaBorrowingRecordDetails[]>([])

        try {
            const mediaBorrowingRecordDetails = await this.mediaBorrowingReaderRepository.getMediaBorrowingRecordsByUserId(userId, offset, limit)

            if (mediaBorrowingRecordDetails != null) {
                result.value = mediaBorrowingRecordDetails
            } 
        } catch(e) {
            result.addError(e as Error)
        } finally {
            return result
        }
    }
}