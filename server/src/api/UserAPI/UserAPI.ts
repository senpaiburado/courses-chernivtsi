import { ControllerInterface, MethodInterface, Method } from "../../abstract/ControllerInterface";
import { Request, Response } from "express";
import { UserManager } from "../../managers/UserManager";

export class UserAPI extends ControllerInterface {
    private manager: UserManager;
    constructor() {
        super('user');
        this.manager = new UserManager;
    }
    
    private register: MethodInterface = {
        path: 'register',
        method: Method.POST,
        handler: async (query: Request, res: Response) => {
            const result = await this.manager.register(query.body);
            res.status(result.getCode()).send(result.toJson());
        }
    }

    private login: MethodInterface = {
        path: 'login',
        method: Method.POST,
        handler: async (query: Request, res: Response) => {
            const result = await this.manager.login(query.body);
            res.status(result.getCode()).json(result.toJson());
        }
    }

    private info: MethodInterface = {
        path: 'info',
        method: Method.GET,
        handler: async (query: Request, res: Response) => {
            console.log(query.headers);
            const result = await this.manager.info(query.query.cookie);
            res.status(result.getCode()).json(result.toJson());
        }
    }

    private files: MethodInterface = {
        path: 'files',
        method: Method.GET,
        handler: async (query: Request, res: Response) => {
            const result = await this.manager.files(query.query.cookie);
            res.status(result.getCode()).json(result.toJson());
        }
    }

    private images: MethodInterface = {
        path: 'images',
        method: Method.GET,
        handler: async (query: Request, res: Response) => {
            const result = await this.manager.images(query.query.cookie, query.query.path);
            res.status(result.getCode()).json(result.toJson());
        }
    }

    public registry: MethodInterface = {
        path: 'registry',
        method: Method.GET,
        handler: async (query: Request, res: Response) => {
            const result = await this.manager.registry(query.query.cookie);
            res.status(result.getCode()).json(result.toJson());
        }
    }

    public pathes(): Array<MethodInterface> {
        return [this.register, this.login, this.info, this.files, this.images, this.registry];
    }
}