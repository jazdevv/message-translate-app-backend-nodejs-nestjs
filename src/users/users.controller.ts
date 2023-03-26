import { Controller, Get, Patch, Post, UsePipes, Res, UseGuards, UseInterceptors, UploadedFile, ParseFilePipeBuilder, Param } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { UsersService } from './users.service';
import { signupDto } from './dtos/signup-user.dto';
import { loginDto } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User as UserDecorator } from 'src/decorators/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/s3/s3.service';


@UsePipes()
@Controller('/auth')
export class UsersController {
    constructor(
        private repo: UsersService,
        private jwtService: JwtService,
        private S3Service: S3Service
    ){}

    @Post('/signup')
    async signupUser(@Body() user: signupDto, @Res({ passthrough: true }) response: Response ){
        //CREATE THE USER
        const newUser = (await this.repo.createUser(user.email, user.username, user.password, false, user.translateMessages, user.translateTo))as User
        //CREATE JWET ACCES TOKEN
        const jwtaccestoken = await this.signandsendJWT(newUser.id)
        //SET THE JWT AS RESPONSE COOKIE
        response.cookie("acces_token",jwtaccestoken,{sameSite:"none",secure:true})
        
        return {
            message:'succes',
            acces_token:jwtaccestoken
        }
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
            message:'succes',
            acces_token:jwtaccestoken
        }
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    myprofile(@UserDecorator() user: User){
        const {password,...userData} = user
        return userData
    }

    @UseInterceptors(FileInterceptor('file'))
    @Post('/UpdateMe')
    @UseGuards(JwtAuthGuard)
    async updateMe( 
        @UserDecorator() loggUser: User,
        @Body() user: any,
        @UploadedFile(
            new ParseFilePipeBuilder()
            .build({fileIsRequired: false,}),
        ) file?: Express.Multer.File,
       
    )
    {   
        let key = `profileImage/${loggUser.id}`;
    
        if(file?.buffer){
           this.S3Service.uploadImageToS3(key,file.buffer);
           this.repo.updateProfilePic(key,loggUser.id);
        }
        
        this.repo.updateUserProfile({username:user.username,status:user.status},loggUser.id)
        
        return
    }

    @UseInterceptors(FileInterceptor('file'))
    @Post('/UpdateMyConfig')
    @UseGuards(JwtAuthGuard)
    async updateMyConfig( 
        @UserDecorator() loggUser: User,
        @Body() user: any,       
    )
    {   
        
        this.repo.updateUserConfig({translateMessages:user.translateMessages,translateTo:user.translateTo},loggUser.id);
        
        return
    }

    private async signandsendJWT(userid: number){
        //CREATE THE PAYLOAD
        const payload = { userid:userid}

        
        return this.jwtService.sign(payload) 
        
    }

    
    @Get('/searchUsers/:queryLetters')
    @UseGuards(JwtAuthGuard)
    async searchUsers(@Param('queryLetters') queryLetters: string){
        
        return await this.repo.findUsersByStartingLetters(queryLetters)
    
    }


}
