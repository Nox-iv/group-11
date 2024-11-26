export class Message<T> {
    public value: T | null
    public errors: Error[]

    constructor(value: T | null, errors: Error[] = []) {
        this.value = value
        this.errors = errors
    }

    addError(error: Error) : void {
        this.errors.push(error)
    }

    hasErrors() : boolean {
        return this.errors.length > 0
    }
}