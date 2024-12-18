import Container from "typedi";
import { Request, Response } from "express";
import { MediaBorrowingReaderApi } from "../../mediaBorrowingReader/api/mediaBorrowingReaderApi";

export async function getMediaBorrowingRecordsForUser(req: Request, res: Response) {
    const mediaBorrowingReaderApi = Container.get(MediaBorrowingReaderApi);
    await mediaBorrowingReaderApi.getMediaBorrowingRecordsForUser(req, res);
}  