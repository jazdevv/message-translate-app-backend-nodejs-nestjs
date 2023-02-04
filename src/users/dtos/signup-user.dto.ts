import { IsEmail, IsString, MinLength } from "class-validator"

export class signupDto {
    
    @IsEmail()
    @IsString()
    email: string

    @IsString()
    username: string

    @IsString()
    @MinLength(4)
    password: string
}