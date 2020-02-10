import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import {TeacherRate} from ".";

@Entity()
export class Teacher extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public firstname: string;

    @Column()
    public lastname: string;

    @Column()
    public email: string;

    @Column()
    public password: string;

    @Column()
    public birthdate: Date;

    @Column()
    public phone: string;

    @OneToMany(type => TeacherRate, rate => rate.teacher)
    public rates: TeacherRate[];

    @Column({default:""})
    public currentKey: String;
}