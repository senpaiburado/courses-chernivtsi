import { ControllerInterface } from "../abstract/ControllerInterface";
import { Md5 } from 'ts-md5/dist/md5';
import { Student, Teacher, Registry } from "../database";
import { UserLoginData, UserSignUpData } from "../interfaces";
import { Http404Error, HttpSuccess, Http403Error } from "../http";
import { Http421Error } from "../http/Http421Error";
import DirectoryTree from "directory-tree";
import {promises} from "fs";
const path = require("path");

const SALT = 1e4 + Math.PI;

export class UserManager {

    public async login(data: UserLoginData): Promise<HttpSuccess | Http404Error> {
        console.log(data);

        let cookieKey = await Md5.hashStr(data.email + SALT + Math.random() * 100);

        // console.log(cookieKey);

        let student = await Student.findOne({ email: data.email });
        // console.log(student);
        if (!student) {
            let teacher = await Teacher.findOne({ email: data.email });
            // console.log(teacher);

            if (teacher) {
                // console.log(teacher.password);
                if (teacher.password !== await Md5.hashStr(data.password + SALT))
                    return new Http404Error("Password is incorrect");
                teacher.currentKey = String(cookieKey);
                await Teacher.save(teacher);
                return new HttpSuccess({
                    cookieKey: cookieKey,
                    isStudent: false
                });
            }

            return new Http404Error('Account not found');
        }
        if (student.password !== await Md5.hashStr(data.password + SALT))
            return new Http403Error("Password is incorrect");
        student.currentKey = String(cookieKey);
        await Student.save(student);
        return new HttpSuccess({
            cookieKey: cookieKey,
            isStudent: true
        });


    }

    public async register(data: UserSignUpData): Promise<HttpSuccess | Http404Error> {
        console.log(data);
        if (await Student.findOne({ email: data.email }))
            return new Http421Error;
        if (await Teacher.findOne({ email: data.email }))
            return new Http421Error;

        let Type;
        if (data.type === 'student')
            Type = Student;
        else
            Type = Teacher;
        let person = new Type;
        person.firstname = data.firstname;
        person.lastname = data.lastname;
        person.email = data.email;
        person.birthdate = data.birthdate;
        person.password = await Md5.hashStr(data.password + SALT);
        person.phone = data.phone;
        person.currentKey = await Md5.hashStr(data.email + SALT + Math.random() * 100);
        console.log(JSON.stringify(person));
        await Type.save(person);

        return new HttpSuccess({
            cookieKey: person.currentKey,
            isStudent: Type === Student
        });
    }

    public async info(cookieKey: string | undefined): Promise<HttpSuccess | Http403Error> {
        console.log(cookieKey);
        let person = await Student.findOne({ currentKey: cookieKey });
        if (!person)
            person = await Teacher.findOne({ currentKey: cookieKey });
        console.log(person)
        if (!person)
            return new Http403Error();

        const data = {
            id: person.id,
            fullname: person.firstname + ' ' + person.lastname,
            birthdate: person.birthdate,
            email: person.email,
            phone: person.phone
        }

        return new HttpSuccess(data);
    }

    public async registry(cookieKey: string | undefined): Promise<HttpSuccess | Http403Error> {
        console.log(cookieKey);
        let person = await Student.findOne({ currentKey: cookieKey });
        if (!person)
            person = await Teacher.findOne({ currentKey: cookieKey });
        console.log(person);
        if (!person)
            return new Http403Error();

        let registry;

        if (person instanceof Teacher) {
            registry = await Registry.find({relations: ['student', 'teacher'], where: { teacher: person }});
        } else if (person instanceof Student) {
            registry = await Registry.find({relations: ['student', 'teacher'], where: { student: person }});
        }

        return new HttpSuccess({
            rows: registry ? registry : null
        });
    }

    public async timetable(cookieKey, startDate): Promise<HttpSuccess | Http403Error> {
        console.log(cookieKey);
        let person = await Student.findOne({ currentKey: cookieKey });
        if (!person)
            person = await Teacher.findOne({ currentKey: cookieKey });
        console.log(person);
        if (!person)
            return new Http403Error();




        return new HttpSuccess();
    }

    public async files(cookieKey): Promise<HttpSuccess | Http403Error> {
        console.log(cookieKey);
        let person = await Student.findOne({ currentKey: cookieKey });
        if (!person)
            person = await Teacher.findOne({ currentKey: cookieKey });
        console.log(person);
        if (!person)
            return new Http403Error();


        let data = DirectoryTree("/home/sendu/ied/courses-server/materials")
        console.log(data);
        return new HttpSuccess({
            data: data
        })
    }

    public async images(cookieKey, path): Promise<HttpSuccess | Http403Error> {
        console.log(cookieKey, path);
        let person = await Student.findOne({ currentKey: cookieKey });
        if (!person)
            person = await Teacher.findOne({ currentKey: cookieKey });
        // console.log(person);
        if (!person)
            return new Http403Error();

        const readdirAsync = (path): Promise<string[]> => {
            return new Promise<string[]>((res, rej) => {
                const fs = require('fs');
                fs.readdir(path, (err, files) => {
                    if (err)
                        rej(err)
                    res(files);
                });
            })
        }

        const fs = require('fs');
        
        let files: string[] = [];
        try {
            files = await readdirAsync(path);
        } catch (ex) {
            files=[];
        }
        let images: string[] = [];
        // console.log(files);

        for (let i =0; i < files.length; i++) {
            // console.log(files[i]);
            let ext = files[i].match(/(?:\.([^.]+))?$/)![1];
            if (!ext)
                continue;
            // console.log(ext)
                if (ext === "png" || ext === "jpg" || ext === "jpeg") {
                    images.push(fs.readFileSync(path + '/'+files[i], 'base64'));
                }
        }


        return new HttpSuccess({
            images: images
        });
    }


}