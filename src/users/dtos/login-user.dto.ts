import { IsEmail, IsString, MinLength } from "class-validator"

export class loginDto {
    
    @IsEmail()
    @IsString()
    email: string

    @IsString()
    @MinLength(4)
    password: string
}