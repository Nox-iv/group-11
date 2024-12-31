export class RequestParsingError extends Error {
    constructor(message: string = "Request property is missing or invalid.") {
        super(message);
        Object.setPrototypeOf(this, RequestParsingError.prototype);
        this.name = 'RequestParsingError';
    }
}