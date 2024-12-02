import { Request, Response } from '@google-cloud/functions-framework';
import { IMediaBorrowingReader } from '../interfaces/logic/IMediaBorrowingReader';

export class MediaBorrowingReaderApi {
    constructor(private readonly mediaBorrowingReader: IMediaBorrowingReader) {}

    async getMediaBorrowingRecordsForUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId);
            const offset = parseInt(req.query.offset as string ?? '0');
            const limit = parseInt(req.query.limit as string ?? '10');

            const result = await this.mediaBorrowingReader.getMediaBorrowingRecordsByUserId(
                userId,
                offset,
                limit
            );

            if (result.hasErrors()) {
                res.status(400).json({ errors: result.errors });
                return;
            }

            res.status(200).json(result.value);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}