export class Message<T> {
    public value: T | null
    public errors: Error[]

    constructor(value: T | null = null, errors: Error[] = []) {
        this.value = value
        this.errors = errors
    }

    addError(error: Error) : void {
        this.errors.push(error)
    }

    addErrorsFromMessage(rmessage : Message<any>) : void {
        if (rmessage.hasErrors()) {
            for (let error of rmessage.errors) {
                this.errors.push(error)
            }
        }
    }

    hasErrors() : boolean {
        return this.errors.length > 0
    }
}