export class InvalidBorrowingDateError extends Error {
    constructor(message = 'Borrowing date range is invalid') {
        super(message)
        Object.setPrototypeOf(this, InvalidBorrowingDateError.prototype);
        this.name = 'InvalidBorrowingDateError';
        this.message = message
    }
}