import { IsEmail, IsNotEmpty, Length, Min, MinLength } from "class-validator";


export class LoginUserDto{

    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @MinLength(6)
    password:string;
}