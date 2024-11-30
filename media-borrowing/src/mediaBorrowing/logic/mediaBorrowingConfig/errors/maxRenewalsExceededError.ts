export class MaxRenewalsExceededError extends Error {
    constructor(message = 'Max renewals exceeded.') {
        super(message)
        Object.setPrototypeOf(this, MaxRenewalsExceededError.prototype);
        this.name = 'MaxRenewalsExceededError';
    }
}