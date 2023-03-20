import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Message } from './messages.entity';
import { RoomsService } from './rooms.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MessagesService {
    constructor(@InjectRepository(Message) private repo: Repository<Message>, private readonly repoRooms:RoomsService){}

    async createMessage(createdBy: User, text: string, image: any, roomid: number){
        //determine the data types of the message
        let type = [];
        let image_uuid: string = null;
        if(image){
            //generate an image uuid
            image_uuid  = "message/image/" + uuidv4() + "_date_" + Date.now();
            type.push("image")
        }
        if(text){
            
            type.push("text")
        }
        const message = await this.repo.create({UserSender:createdBy.id,text,roomid,type,imageUrl:image_uuid});
        this.repo.save(message);
        
        return message
    }

    getMessages(){
        
    }
}
