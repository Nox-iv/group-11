import { Request, Response } from 'express';
import { IAmlBranchReader } from '../interfaces/logic/IAmlBranchReader';
import { HttpErrorHandler } from '../../shared/http/httpErrorHandler';
import { RequestParsingError } from '../../shared/errors/requestParsingError';

export class AmlBranchReaderApi {
    constructor(
        private readonly amlBranchReader : IAmlBranchReader,
        private readonly httpErrorHandler: HttpErrorHandler
    ) {}

    async getBranchesByLocationId(req: Request, res: Response): Promise<void> {
        try {
            const { locationId } = this.parseLocationId(req);

            const result = await this.amlBranchReader.getBranchesByLocationId(locationId);

            if (result.hasErrors()) {
                res.status(400).json({ errors: result.errors });
            } else {
                res.status(200).json({ data: result.value });
            }
        } catch (error) {
            this.httpErrorHandler.handle(error, res);
        }
    }

    private parseLocationId(req: Request): { locationId: number } {
        const locationId = parseInt(req.params?.locationId ?? undefined);
        if (locationId == undefined) {
            throw new RequestParsingError('Missing required field: locationId');
        }
        if (isNaN(locationId)) {
            throw new RequestParsingError('Invalid location ID format');
        }

        return { locationId };
    }
}