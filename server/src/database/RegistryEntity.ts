import {BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne} from "typeorm";
import {Student, Teacher} from ".";

@Entity()
export class Registry extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(type => Student, student => student.id)
    public student: Student;

    @ManyToOne(type => Teacher, teacher => teacher.id)
    public teacher: Teacher;

    @Column()
    public comment: string;

    @Column()
    public homework: string;
}