import {HttpResult} from "./HttpResult";

export class Http404Error extends HttpResult {
    constructor(message: string = "") {
        super(message.length === 0 ? "Not found" : message, 404);
    }
}