import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import {TeacherRate} from ".";

@Entity()
export class TimeTableLesson extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public startDate: Date;

    @Column()
    public endDate: Date;

    @Column()
    public hour: number;
}