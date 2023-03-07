import { Controller, Get, Patch, Post, UsePipes, Res } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { UsersService } from './users.service';
import { signupDto } from './dtos/signup-user.dto';
import { loginDto } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { Response } from 'express';


@UsePipes()
@Controller('/auth')
export class UsersController {
    constructor(
        private repo: UsersService,
        private jwtService: JwtService 
    ){}

    @Post('/signup')
    async signupUser(@Body() user: signupDto, @Res({ passthrough: true }) response: Response ){
        //CREATE THE USER
        const newUser = (await this.repo.createUser(user.email, user.username, user.password, false))as User

        //CREATE JWET ACCES TOKEN
        const jwtaccestoken = await this.signandsendJWT(newUser.id)
        //SET THE JWT AS RESPONSE COOKIE
        response.cookie("acces_token",jwtaccestoken,{sameSite:"none",secure:true})//httpOnly:true,
        
        return
    }

    @Post('/login')
    async loginUser(@Body() user: loginDto, @Res({ passthrough: true }) response: Response){
        //USER LOGIN
        const loggedUser = (await this.repo.loginUser(user.email,user.password)) as User
        //CREATE JWET ACCES TOKEN
        const jwtaccestoken = await this.signandsendJWT(loggedUser.id)
        
        //SET THE JWT AS RESPONSE COOKIE
        response.cookie("acces_token",jwtaccestoken,{sameSite:"none",secure:true})
        
        return {
            message:'succes'
        }
    }

    private async signandsendJWT(userid: number){
        //CREATE THE PAYLOAD
        const payload = { userid:userid}

        
        return this.jwtService.sign(payload) 
        
    }

}
