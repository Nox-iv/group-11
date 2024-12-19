import { Response as GCloudResponse } from 'express';
import { RequestParsingError } from "../errors/requestParsingError";

export class HttpErrorHandler {
    handle(error: unknown, res: GCloudResponse): void {
        if (error instanceof RequestParsingError) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}