import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

interface dataToUpdate {
    username: String,
    status: String  
}
@Injectable()

export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>){}

    async createUser(email: string, username: string,password: string,isGoogleUser: boolean) {

        //CHECK USER DONT EXIST WITH THAT EMAIL OR USERNAME
        const EmailExists =  await this.repo.find({where:{email:email}})
        if(EmailExists.length > 0){throw new BadRequestException("email  already in use")}
        const UserNameExists = await this.repo.find({where:{username:username}})
        if(UserNameExists.length  > 0 ){ throw new BadRequestException("name  already in use")}
        //HASH THE PASSWORD
        const salt = await bcrypt.genSalt();
        const hashedpassword = await bcrypt.hash(password,salt)
        //CREATE THE USER
        const user = this.repo.create({email,username,password:hashedpassword,isGoogleUser})
        this.repo.save(user);

        return user
    }

    async loginUser(email: string, password: string){

        //GET USER
        const user =  await this.repo.findOne({where:{email:email}})
        //THROW ERROR IF USER WITH THAT EMAIL DONT EXISTS
        if(!user){throw new BadRequestException("email not registred with that password")}
        //COMPARE INPUT PASSWORD WITH THE DATABASE USER HASHED PASSWORD //match = true , dont match = false
        const passwordMatches: boolean = await bcrypt.compare(password,user.password)
        //IF PASSOWRD DONT MATCHES THROW AN ERROR
        if(passwordMatches === false){throw new BadRequestException("password incorrect")}

        return user
    }

    async findUser(userid: number){
        const user = await this.repo.findOne({where:{id:userid}})
        //GET USER
        return user
    }

    async findUserProfile(userid: number){
        const user = await this.repo.findOne({where:{id:userid},select:['username','profileImage','id','status']})
        //GET USER
        return user
    }
    
    async findUserByName(username: string){
        const user = this.repo.findOne({where:{username:username}})
        //GET USER
        return user
    }

    async updateProfilePic(key: string, userid: number){
        const query = `UPDATE "user" SET "profileImage" = '${key}' WHERE "id" = ${userid}`
        await this.repo.query(query);

        return
    }

    
    async updateUserProfile(user,userid: number){
        const query = `UPDATE "user" SET "username" = '${user.username}',"status" = '${user.status}' WHERE "id" = ${userid}`
        await this.repo.query(query);

        return
    }
}
