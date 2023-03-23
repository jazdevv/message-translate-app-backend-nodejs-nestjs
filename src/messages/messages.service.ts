import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Message } from './messages.entity';
import { RoomsService } from './rooms.service';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


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

    async getMessages(roomid: number,skip: number, user: User){
        //GET MESSAGES
        const sqlquery = `SELECT * FROM message WHERE roomid = ${roomid} ORDER BY "createdAt" DESC LIMIT 15 OFFSET ${skip}` 
        const messages = await this.repo.query(sqlquery);

        //RETURN IF USER HAVE TRANSLATE MESSAGES OPTION NOT ACTIVATED
        if(user.translateMessages === false){
            return messages
        }
        
        //TRANSLATE MESSAGES IF USER HAVE THAT OPTION ACTIVATED

        //create array of only the messages
        const messages_to_translate = [];
        messages.map(message=>{
            if(message.text){
                messages_to_translate.push(message.text)  
            }
        })
        
        //translate the messages array
        const translatedMessages = await this.translateMessage(messages_to_translate,user.translateTo);
        //if cannot realize the translate just return untranslated messages
        if(translatedMessages.translated === false){
            return messages;
        }
        //replace translated messages with unstralated ones
        const finalMessages = [];
        for( let i = 0; i < messages.length; i++){
            finalMessages.push({...messages[i],text:translatedMessages.messages[i]});
        }
        
        //return translated messages
        return finalMessages
    }

    //can translarte a single message or array of messages
    async translateMessage(message: string | string[],languageTo: string){
        
        try{
            const encodedParams = new URLSearchParams();
            encodedParams.append("text", message as string);
            encodedParams.append("from", "auto");
            encodedParams.append("to", languageTo);

            const options = {
            method: 'POST',
            url: 'https://translate281.p.rapidapi.com/',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': 'bc450e073fmsh0423cd5a3083d3dp1c5018jsn5c042f771a6d',
                'X-RapidAPI-Host': 'translate281.p.rapidapi.com'
            },
            data: encodedParams
            };

            const res = await axios.request(options);
            const translatedMessages = res.data.response.split(',')
            return {messages:translatedMessages,translated:true };
        }catch(err){
            console.log(err)
            return {messages:message,translated:false}
        }
        }
}
 