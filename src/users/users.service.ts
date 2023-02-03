import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>){}

    async createUser(email: string, username: string,password: string,isGoogleUser: boolean) {

        //CHECK USER DONT EXIST WITH THAT EMAIL OR USERNAME
        const EmailExists =  await this.repo.find({where:{email:email}})
        if(EmailExists.length > 0){return new BadRequestException("email  already in use")}
        const UserNameExists = await this.repo.find({where:{username:username}})
        if(UserNameExists.length  > 0 ){return new BadRequestException("name  already in use")}

        //CREATE THE USER
        const user = this.repo.create({email,username,password,isGoogleUser})
        this.repo.save(user);

        return user
    }

    async loginUser(email: string, password: string){
        
        //VERIFY USER EXISTS & PASSWORDS MATCHES
        const user =  await this.repo.findOne({where:{email:email}})
        if(!user){return new BadRequestException("email not registred with that password")}
        if(user.password != password){return new BadRequestException("password incorrect")}

        return user
    }
    
}
