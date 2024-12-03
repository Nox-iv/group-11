import { Request, Response } from '@google-cloud/functions-framework';
import { RequestContext } from './requestContext';
import { IDbContext } from '../../../db/interfaces/dbContext';
import { DbContext } from '../../../db/dbContext';

export async function requestContextMiddleware(req: Request, res: Response, next: Function) {
    return RequestContext.runWithContext(async () => {
        const container = RequestContext.currentContainer;
        
        container.set(IDbContext, DbContext);
        
        try {
            await next();
        } finally {
            await container.get(IDbContext).close();
            RequestContext.cleanup();
        }
    });
}