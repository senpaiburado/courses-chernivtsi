import {HttpResult} from "./HttpResult";

export class Http421Error extends HttpResult {
    constructor(message: string = "") {
        super(message.length === 0 ? "Resourse exists" : message, 421);
    }
}