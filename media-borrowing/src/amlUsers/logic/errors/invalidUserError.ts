export class InvalidUserError extends Error {
    constructor(message = 'User does not exist.') {
        super(message)
        Object.setPrototypeOf(this, InvalidUserError.prototype);
        this.name = 'InvalidUserError';
    }
}