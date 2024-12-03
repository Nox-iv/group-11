import Container from "typedi"
import { MediaBorrowingReader } from "../../mediaBorrowingReader/logic/MediaBorrowingReader"
import { IMediaBorrowingReader } from "../../mediaBorrowingReader/interfaces/logic/IMediaBorrowingReader"
import { IDbConnectionFactory } from "../../db/interfaces/connection/IDbConnectionFactory"
import { MediaBorrowingRecordReaderRepository } from "../../mediaBorrowingReader/data/repositories/MediaBorrowingRecordReaderRepository"

export function setupMediaBorrowingReader(dbConnectionFactory : IDbConnectionFactory) {
    const mediaBorrowingRecordReaderRepository = new MediaBorrowingRecordReaderRepository(dbConnectionFactory)

    const mediaBorrowingReader = new MediaBorrowingReader(mediaBorrowingRecordReaderRepository)
    Container.set(IMediaBorrowingReader, mediaBorrowingReader)
}