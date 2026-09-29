import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString, Length, MinLength, minLength } from "class-validator";


enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    name!:string;

    @IsNotEmpty()
    @IsString()
    lastName!:string;

    @IsNotEmpty()
    @IsString()
    @Length(12,12)
    phone!:string;

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email!:string;

    @IsNotEmpty()
    @IsString()
    address!:string;

    @IsEnum(UserRole)
    @IsString() 
    role?:string=UserRole.USER;

    @IsBoolean()
    state?:boolean=true;
     
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password!:string;
}

