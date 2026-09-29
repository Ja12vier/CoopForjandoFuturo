import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import  * as bcrypt from  "bcrypt";
import { Exclude, Expose } from "class-transformer";
import { UsersClient } from "src/modules/users-clients/entities/users-client.entity";
import { Payment } from "src/modules/payments/entities/payment.entity";
enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

@Entity()

export class User {
    @Expose()
    @PrimaryGeneratedColumn()
    id!:number;
    
    @Expose()
    @Column()
    name!:string;
    
    @Expose()
    @Column()
    lastName!:string;
    
    @Expose()
    @Column({unique:true})
    phone!:string;

    @Expose()
    @Column({unique:true})
    email!:string;
    
    @Expose()
    @Column()
    address!:string;
    
    @Expose()
    @Column({
    type:'enum',
    enum: UserRole,
    default:'user'})
    role?:string;
    
    @Expose()
    @Column({default:true})
    state?:boolean;
   
    @Exclude()
    @Column()
    password!:string;
    
    @BeforeUpdate()
    @BeforeInsert()
    async hashPassword() {
       this.password = await bcrypt.hash(this.password,10);
    }

    @OneToMany(() => UsersClient, (usersClient) => usersClient.user, { cascade: ['insert','update']})
    usersClient!: UsersClient[];

    @OneToMany(() => UsersClient, (usersClient) => usersClient.user, { cascade: ['insert','update']})
    usersClients!: UsersClient[];
    
    @OneToMany(() =>Payment, (payment) => payment.user, { cascade: ['insert','update']})
    payments!: Payment[];
}


