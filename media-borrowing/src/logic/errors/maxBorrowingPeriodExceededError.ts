export class MaxBorrowingPeriodExceededError extends Error {
    constructor(message = 'Max borrowing period exceeded,') {
        super(message)
        Object.setPrototypeOf(this, MaxBorrowingPeriodExceededError.prototype);
        this.name = 'MaxBorrowingPeriodExceededError';
    }
}