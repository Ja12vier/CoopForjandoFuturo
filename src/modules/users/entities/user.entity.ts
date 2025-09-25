import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import  * as bcrypt from  "bcrypt";
enum TypeUser {
    ADMIN = 'admin',
    USER = 'user'
}

@Entity()

export class User {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column()
    lastName:string;

    @Column({unique:true})
    phone:string;

    @Column({unique:true})
    email:string;

    @Column()
    address:string;

    @Column({
        type:'enum',
        enum:TypeUser,
        default:'user'})
    typeUser?:string;
    
    @Column({default:true})
    state?:boolean;

    @Column()
    password:string;

    @BeforeInsert()
    async hashPassword() {
       const handlePassword= await bcrypt.hash(this.password,10);
    }
}
