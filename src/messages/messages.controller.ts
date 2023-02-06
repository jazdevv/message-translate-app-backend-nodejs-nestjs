import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { RoomsService } from './rooms.service';

@Controller('')
export class MessagesController {
    constructor(private repoRooms: RoomsService){}

    @Get('/chat/:username')
    chooseChat(@Res() res: Response){
        //temporary till implement the frontend logic
        res.cookie("acces_token","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjksImlhdCI6MTY3NTU0ODcyMiwiZXhwIjoxNjgzMzI0NzIyfQ.Wl6tia-ePCKrsdjZH_9hps69n9U6bTlYgsIIA7tfrfY")
        //render the template
        return res.render('chat',{layout:"chat"});

    }

    @Get('/chats')
    userChat(){

    }

}

