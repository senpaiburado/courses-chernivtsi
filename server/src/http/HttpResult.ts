export abstract class HttpResult {

    private message: string | object;
    private code: number;
    private isError: boolean;
    private data: object;

    constructor(message: string | object, code: number, error: boolean = true, data: object = {}) {
        this.message = message;
        this.code = code;
        this.isError = error;
        this.data = data;
    }

    public toJson(): object {
        return {
            message: this.message,
            code: this.code,
            is_error: this.isError,
            data: this.data
        }
    }

    public getCode(): number {
        return this.code;
    }
}