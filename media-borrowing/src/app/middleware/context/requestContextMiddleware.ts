import { Request, Response } from 'express';
import { RequestContext } from './requestContext';
import { IDbContext } from '../../../db/interfaces/dbContext';
import { DbContext } from '../../../db/dbContext';
import Container from 'typedi';
import { IUnitOfWorkFactory } from '../../../db/interfaces/uow/IUnitOfWorkFactory';

export async function requestContextMiddleware(req: Request, res: Response, next: Function) {
    return RequestContext.runWithContext(async () => {
        const container = RequestContext.currentContainer;
        
        const dbContext = new DbContext(Container.get<IUnitOfWorkFactory>(IUnitOfWorkFactory))
        container.set(IDbContext, dbContext);
        
        try {
            await next();
        } finally {
            const dbContext = container.get(IDbContext)
            if (!dbContext.isClosed()) {
                await dbContext.rollback()
                RequestContext.cleanup();
                res.status(500).send("Transaction has not been closed - data changes rolled back.")
            }

            RequestContext.cleanup();
        }
    });
}