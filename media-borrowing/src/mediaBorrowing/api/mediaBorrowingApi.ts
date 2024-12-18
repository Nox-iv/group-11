import { Request, Response } from 'express';
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
                res.status(400).json({ errors: result.errors.map(e => e.message) });
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
                res.status(400).json({ errors: result.errors.map(e => e.message) });
                return;
            }

            res.status(200).json(result.value);
        } catch (error) {
            this.httpErrorHandler.handle(error, res);
        }
    }

    private parseBorrowingRequest(req: Request): MediaBorrowingRecord {

        if (!req.body?.userId) {
            throw new RequestParsingError('Missing required field: userId');
        }
        if (!req.body?.mediaId) {
            throw new RequestParsingError('Missing required field: mediaId');
        }
        if (!req.body?.branchId) {
            throw new RequestParsingError('Missing required field: branchId');
        }
        if (!req.body?.startDate) {
            throw new RequestParsingError('Missing required field: startDate');
        }
        if (!req.body?.endDate) {
            throw new RequestParsingError('Missing required field: endDate');
        }

        const { userId, mediaId, branchId, startDate, endDate } = req.body;

        const parsedUserId = parseInt(userId);
        const parsedMediaId = parseInt(mediaId);
        const parsedBranchId = parseInt(branchId);

        if (isNaN(parsedUserId)) {
            throw new RequestParsingError('Invalid user ID.');
        }

        if (isNaN(parsedMediaId)) {
            throw new RequestParsingError('Invalid media ID.');
        }   

        if (isNaN(parsedBranchId)) {
            throw new RequestParsingError('Invalid branch ID.');
        }

        let parsedStartDate: Date;
        let parsedEndDate: Date;

        try {
            parsedStartDate = new Date(startDate);
        } catch (error) {
            throw new RequestParsingError('Invalid start date format.');
        }

        try {
            parsedEndDate = new Date(endDate);
        } catch (error) {
            throw new RequestParsingError('Invalid end date format.');
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

        if (!mediaBorrowingRecordId) {
            throw new RequestParsingError('Missing required field: mediaBorrowingRecordId');
        }

        if (!renewedEndDate) {
            throw new RequestParsingError('Missing required field: renewedEndDate');
        }

        const parsedRecordId = parseInt(mediaBorrowingRecordId);

        if (isNaN(parsedRecordId)) {
            throw new RequestParsingError('Invalid media borrowing record ID');
        }

        let parsedEndDate: Date;
        try {
            parsedEndDate = new Date(renewedEndDate);
        } catch (error) {
            throw new RequestParsingError('Invalid renewal date format');
        }

        return {
            mediaBorrowingRecordId: parsedRecordId,
            renewedEndDate: parsedEndDate
        };
    }

    private parseReturnRequest(req: Request): number {
        if (!req.body?.mediaBorrowingRecordId) {
            throw new RequestParsingError('Missing required field: mediaBorrowingRecordId');
        }

        const { mediaBorrowingRecordId } = req.body;

        const parsedMediaBorrowingRecordId = parseInt(mediaBorrowingRecordId);

        if (isNaN(parsedMediaBorrowingRecordId)) {
            throw new RequestParsingError('Invalid media borrowing record ID format');
        }

        return parsedMediaBorrowingRecordId;
    }
}