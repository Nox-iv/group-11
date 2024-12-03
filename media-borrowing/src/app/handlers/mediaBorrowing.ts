import { Container } from 'typedi';
import { MediaBorrowingApi } from '../../mediaBorrowing/api/mediaBorrowingApi';
import { Request, Response } from '@google-cloud/functions-framework';

export async function borrowMediaItem(req: Request, res: Response) {
    const mediaBorrowingApi = Container.get(MediaBorrowingApi);
    await mediaBorrowingApi.borrowMediaItem(req, res);
}

export async function renewMediaItemHandler(req: Request, res: Response) {
    const mediaBorrowingApi = Container.get(MediaBorrowingApi);
    await mediaBorrowingApi.renewMediaItem(req, res);
}

export async function returnMediaItemHandler(req: Request, res: Response) {
    const mediaBorrowingApi = Container.get(MediaBorrowingApi);
    await mediaBorrowingApi.returnMediaItem(req, res);
}