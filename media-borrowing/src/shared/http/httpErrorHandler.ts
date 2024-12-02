import { Response } from "express";
import { RequestParsingError } from "../errors/requestParsingError";

export class HttpErrorHandler {
    handle(error: unknown, res: Response): void {
        if (error instanceof RequestParsingError) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}