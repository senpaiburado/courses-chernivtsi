import { HttpResult } from "../http/HttpResult";
import { Request, Response } from "express";

export class ControllerInterface {

    private path: string;

    constructor(controllerPath: string) {
        this.path = controllerPath;
    }

    public controllerPath() {
        return this.path;
    }

    public pathes(): Array<MethodInterface> {
        return [];
    }
}

export type MethodInterface = {
    path: string;
    method: Method;
    handler: (request: Request, response: Response) => Promise<HttpResult | void>;
};

export enum Method {
    GET,
    POST
}