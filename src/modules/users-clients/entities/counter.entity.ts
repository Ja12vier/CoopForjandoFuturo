import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Counter{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column({default:0})
    lastAccountNumber!:number;
}