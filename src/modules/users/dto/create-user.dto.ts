import { IsBoolean, IsEmail, IsEnum, isEnum, IsNotEmpty, IsString, Length, MinLength, minLength } from "class-validator";
import { BeforeInsert } from "typeorm";

enum TypeUser {
    ADMIN = 'admin',
    USER = 'user'
}

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @IsString()
    lastName:string;

    @IsNotEmpty()
    @IsString()
    @Length(12,12)
    phone:string;

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email:string;

    @IsNotEmpty()
    @IsString()
    address:string;

    @IsEnum(TypeUser)
    @IsString() 
    typeUser?:string=TypeUser.USER;

    @IsBoolean()
    state?:boolean=true;
     
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password:string;
}

