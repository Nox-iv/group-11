export class NotImplementedError extends Error {
    constructor(message = 'Method has not been implemented.') {
        super(message)
        Object.setPrototypeOf(this, NotImplementedError.prototype);
        this.name = 'NotImplementedError';
    }
}