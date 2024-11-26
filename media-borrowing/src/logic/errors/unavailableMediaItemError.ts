export class UnavailableMediaItemError extends Error {
    constructor(message = 'Media item is unavailable.') {
        super(message)
        Object.setPrototypeOf(this, UnavailableMediaItemError.prototype);
        this.name = 'UnavailableMediaItemError';
    }
}