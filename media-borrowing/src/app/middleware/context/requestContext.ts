import { AsyncLocalStorage } from 'async_hooks';
import { ContainerInstance, Container } from 'typedi';
import { IDbContext } from '../../../db/interfaces/dbContext';

export class RequestContext {
    private static asyncLocalStorage = new AsyncLocalStorage<ContainerInstance>();

    static get currentContainer(): ContainerInstance {
        const container = this.asyncLocalStorage.getStore();
        if (!container) {
            throw new Error('No request context found. Ensure middleware is properly configured.');
        }
        return container;
    }

    static get dbContext(): IDbContext {
        return this.currentContainer.get(IDbContext);
    }

    static async runWithContext<T>(callback: () => Promise<T>): Promise<T> {
        const container = Container.of(crypto.randomUUID());
        return this.asyncLocalStorage.run(container, callback);
    }

    static cleanup(): void {
        const container = this.asyncLocalStorage.getStore();
        if (container) {
            Container.reset(container.id);
        }
    }
}