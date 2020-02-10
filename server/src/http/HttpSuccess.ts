import {HttpResult} from "./HttpResult";

export class HttpSuccess extends HttpResult {
    constructor(data: object = {}, message: string = "") {
        super(message.length === 0 ? "Success" : message, 200, false, data);
    }
}