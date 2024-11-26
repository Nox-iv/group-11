export class InvalidMediaError extends Error {
    constructor(message = 'User does not exist.') {
        super(message)
        Object.setPrototypeOf(this, InvalidMediaError.prototype);
        this.name = 'InvalidMediaError';
    }
}