export class Message<T> {

    public _value: T | null = null;
    private _errors : Error[] = [];

    constructor(value: T | null) {
        this.value = value;
    }

    public get value(): T | null {
        return this._value;
    }

    public set value(value: T | null) {
        this._value = value;
    }

    public get errors(): Error[] {
        return this._errors;
    }

    public addError(error: Error) {
        this._errors.push(error);
    }

    public hasErrors(): boolean {
        return this._errors.length > 0;
    }
}