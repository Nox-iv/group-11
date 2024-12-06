export class InvalidBorrowingRecordError extends Error {
    constructor(message = 'Borrowing record is invalid.') {
        super(message)
        Object.setPrototypeOf(this, InvalidBorrowingRecordError.prototype);
        this.name = 'InvalidBorrowingRecordError';
    }
}