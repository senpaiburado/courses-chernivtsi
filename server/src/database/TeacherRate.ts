import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, ManyToOne} from "typeorm";
import {Teacher} from ".";

@Entity()
export class TeacherRate extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public rate: number;

    @ManyToOne(type => Teacher, teacher => teacher.rates)
    public teacher: Teacher;
}