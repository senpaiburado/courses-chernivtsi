import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class Student extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public firstname: string;

    @Column()
    public lastname: string;

    @Column()
    public birthdate: Date;

    @Column()
    public email: string;

    @Column()
    public password: string;

    @Column()
    public phone: string;

    @Column()
    public currentKey: String;
}