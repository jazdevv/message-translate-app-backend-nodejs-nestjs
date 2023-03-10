import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/get-user.decorator';

@Controller('/messages')
export class MessagesController {
    constructor(private repoRooms: RoomsService){}

    @Get('/rooms')
    @UseGuards(JwtAuthGuard)
    getUserRooms(@User() user){
        
        return this.repoRooms.getUserRooms(user.id)
    }

}

