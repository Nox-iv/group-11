import { Request, Response } from '@google-cloud/functions-framework';
import { IMediaBorrowingLogic } from '../interfaces/logic/mediaBorrowing/IMediaBorrowingLogic';
import { IMediaRenewalLogic } from '../interfaces/logic/mediaRenewals/IMediaRenewalLogic';
import { IMediaReturnLogic } from '../interfaces/logic/mediaReturns/IMediaReturnLogic';
import { MediaBorrowingRecord } from '../data/models';
import { MediaRenewalRequest } from '../logic/mediaRenewals/dto/MediaRenewalRequest';
import { HttpErrorHandler } from '../../shared/http/httpErrorHandler';
import { RequestParsingError } from '../../shared/errors/requestParsingError';

export class MediaBorrowingApi {
    constructor(
        private readonly mediaBorrowingLogic: IMediaBorrowingLogic,
        private readonly mediaRenewalLogic: IMediaRenewalLogic,
        private readonly mediaReturnLogic: IMediaReturnLogic,
        private readonly httpErrorHandler: HttpErrorHandler
    ) {}

    async borrowMediaItem(req: Request, res: Response): Promise<void> {
        try {
            const borrowingRecord = this.parseBorrowingRequest(req);
            const result = await this.mediaBorrowingLogic.BorrowMediaItem(borrowingRecord);
            
            if (result.hasErrors()) {
                res.status(400).json({ errors: result.errors });
                return;
            }

            res.status(200).json(result.value);
        } catch (error) {
            this.httpErrorHandler.handle(error, res);
        }
    }

    async renewMediaItem(req: Request, res: Response): Promise<void> {
        try {
            const renewalRequest = this.parseRenewalRequest(req);
            const result = await this.mediaRenewalLogic.renewMediaItem(renewalRequest);
            
            if (result.hasErrors()) {
                res.status(400).json({ errors: result.errors });
                return;
            }

            res.status(200).json(result.value);
        } catch (error) {
            this.httpErrorHandler.handle(error, res);
        }
    }

    async returnMediaItem(req: Request, res: Response): Promise<void> {
        try {
            const recordId = this.parseReturnRequest(req);
            const result = await this.mediaReturnLogic.returnMediaItem(recordId);
            
            if (result.hasErrors()) {
                res.status(400).json({ errors: result.errors });
                return;
            }

            res.status(200).json(result.value);
        } catch (error) {
            this.httpErrorHandler.handle(error, res);
        }
    }

    private parseBorrowingRequest(req: Request): MediaBorrowingRecord {
        const { userId, mediaId, branchId, startDate, endDate } = req.body;

        if (!userId || !mediaId || !branchId || !startDate || !endDate) {
            throw new RequestParsingError('Missing required fields for borrowing request');
        }

        const parsedUserId = parseInt(userId);
        const parsedMediaId = parseInt(mediaId);
        const parsedBranchId = parseInt(branchId);
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        if (isNaN(parsedUserId) || isNaN(parsedMediaId) || isNaN(parsedBranchId)) {
            throw new RequestParsingError('Invalid numeric values provided');
        }

        if (parsedStartDate.toString() === 'Invalid Date' || parsedEndDate.toString() === 'Invalid Date') {
            throw new RequestParsingError('Invalid date format');
        }

        return {
            mediaBorrowingRecordId: 0,
            userId: parsedUserId,
            mediaId: parsedMediaId,
            branchId: parsedBranchId,
            startDate: parsedStartDate,
            endDate: parsedEndDate,
            renewals: 0
        };
    }

    private parseRenewalRequest(req: Request): MediaRenewalRequest {
        const { mediaBorrowingRecordId, renewedEndDate } = req.body;

        if (!mediaBorrowingRecordId || !renewedEndDate) {
            throw new RequestParsingError('Missing required fields for renewal request');
        }

        const parsedRecordId = parseInt(mediaBorrowingRecordId);
        const parsedEndDate = new Date(renewedEndDate);

        if (isNaN(parsedRecordId)) {
            throw new RequestParsingError('Invalid media borrowing record ID');
        }

        if (parsedEndDate.toString() === 'Invalid Date') {
            throw new RequestParsingError('Invalid renewal date format');
        }

        return {
            mediaBorrowingRecordId: parsedRecordId,
            renewedEndDate: parsedEndDate
        };
    }

    private parseReturnRequest(req: Request): number {
        const { mediaBorrowingRecordId } = req.params;

        if (!mediaBorrowingRecordId) {
            throw new RequestParsingError('Missing media borrowing record ID');
        }

        const parsedId = parseInt(mediaBorrowingRecordId);
        if (isNaN(parsedId)) {
            throw new RequestParsingError('Invalid media borrowing record ID format');
        }

        return parsedId;
    }
}