import { Controller, Get, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/get-user.decorator';
import { MessagesService } from './messages.service';
import { WsException } from '@nestjs/websockets';

@Controller('/messages')
export class MessagesController {
    constructor(private repoRooms: RoomsService,private repoMessages: MessagesService){}

    @Get('/rooms')
    @UseGuards(JwtAuthGuard)
    getUserRooms(@User() user){
        
        return this.repoRooms.getUserRooms(user.id)
    }

    @Get('/:roomid/:skip/:firstrender')
    @UseGuards(JwtAuthGuard)
    async getMessagesFirstRender(@Param('roomid') roomid: number, @Param('skip')skip: number,@Param('firstrender') firstrender: boolean, @User() user){
        //CHECK IF USER IS PART OF THE ROOM
        const isValid = await this.repoRooms.isUserInRoomID(user.id,roomid);
        if(isValid===false){
            throw new WsException('not authorized');
        }
        //GET MESSAGES OF CONVERSATION
        const messages = await this.repoMessages.getMessages(roomid,skip,user);
        
        if(firstrender===true){
            //GET CONVERSATION DETAILS
            const conversationDetails = await this.repoRooms.getConversationDetails(roomid,user.id);
    
            return {messages,conversationDetails:conversationDetails}  
        }
        return {messages}


        
    }
}

