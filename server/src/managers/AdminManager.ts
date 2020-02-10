import {ControllerInterface} from "../abstract/ControllerInterface";
import {Md5} from "ts-md5/dist/md5";
import {Admin, Teacher, Student} from "../database";
import * as model from '../interfaces/admin';
import {HttpSuccess, Http403Error} from '../http';
import { HttpResult } from "../http/HttpResult";

const SALT = 1e4 + Math.PI;

export class AdminManager {
    public async login(data: model.AdminLoginData): Promise<HttpResult> {
        console.log(data);

        let key = await Md5.hashStr(data.email + SALT + Math.random() * 100);

        let person = await Teacher.find({email: data.email});
        if (!person) {
            // person = await Student.fi
        }


        return new HttpSuccess({

        });
    }

    public async register(data: model.AdminSignUpData): Promise<boolean> {
        if (await Admin.findOne({username: data.username}))
            return false;

        let admin = new Admin;
        admin.name = data.name;
        admin.username = data.username;
        admin.email = data.email;
        // admin.password = await hash(data.password, SALT); TO-DO: Fix hashing
        await Admin.save(admin);

        return true;
    }

    
}