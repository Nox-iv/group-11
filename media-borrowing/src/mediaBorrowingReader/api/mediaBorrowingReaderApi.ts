import { Request, Response } from 'express';
import { IMediaBorrowingReader } from '../interfaces/logic/IMediaBorrowingReader';
import { HttpErrorHandler } from '../../shared/http/httpErrorHandler';
import { RequestParsingError } from '../../shared/errors/requestParsingError';

export class MediaBorrowingReaderApi {
    constructor(
        private readonly mediaBorrowingReader: IMediaBorrowingReader,
        private readonly httpErrorHandler: HttpErrorHandler
    ) {}

    async getMediaBorrowingRecordsForUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId, offset, limit } = this.parseGetRecordsForUserRequest(req);
            
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
            this.httpErrorHandler.handle(error, res);
        }
    }

    private parseGetRecordsForUserRequest(req: Request): { userId: number, offset: number, limit: number } {
        const userId = parseInt(req.params.userId);
        const offset = parseInt(req.query.offset as string ?? '0');
        const limit = parseInt(req.query.limit as string ?? '10');

        if (!userId) {
            throw new RequestParsingError('Missing required field: userId');
        }

        if (isNaN(userId)) {
            throw new RequestParsingError('Invalid user ID format');
        }

        if (isNaN(offset) || offset < 0) {
            throw new RequestParsingError('Invalid offset value');
        }

        if (isNaN(limit) || limit < 1) {
            throw new RequestParsingError('Invalid limit value');
        }

        return { userId, offset, limit };
    }
}