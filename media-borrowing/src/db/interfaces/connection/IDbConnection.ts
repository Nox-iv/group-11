import { IDbTransaction } from './IDbTransaction'
import { NotImplementedError } from '../../../shared/errors/notImplementedError'

export class IDbConnection {
    constructor() {}

    async query<T>(queryText: string, params: any[] = []) : Promise<T[]> {
        throw new NotImplementedError()
    }

    async command<T>(commandText: string, params: any[]) : Promise<void> {
        throw new NotImplementedError()
    }

    async beginTransaction() : Promise<IDbTransaction> {
        throw new NotImplementedError()
    }

    close() : void {
        throw new NotImplementedError()
    }
} 