import { Request, Response } from 'express';
import Container from 'typedi';
import { AmlBranchReaderApi } from '../../amlBranchReader/api/amlBranchReaderApi';

export async function getBranchesByLocationId(req: Request, res: Response) {
    const amlBranchReaderApi = Container.get(AmlBranchReaderApi);
    await amlBranchReaderApi.getBranchesByLocationId(req, res);
}  