export class InvalidBranchError extends Error {
    constructor(message = 'Invalid branch.') {
        super(message)
        Object.setPrototypeOf(this, InvalidBranchError.prototype);
        this.name = 'InvalidBranchError';
    }
}