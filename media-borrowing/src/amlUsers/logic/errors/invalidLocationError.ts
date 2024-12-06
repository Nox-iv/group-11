export class InvalidLocationError extends Error {
    constructor(message = 'Invalid location.') {
        super(message)
        Object.setPrototypeOf(this, InvalidLocationError.prototype);
        this.name = 'InvalidLocationError';
    }
}