import {HttpResult} from "./HttpResult";

export class Http403Error extends HttpResult {
    constructor(message: string = "") {
        super(message.length === 0 ? "Access denied" : message, 403);
    }
}