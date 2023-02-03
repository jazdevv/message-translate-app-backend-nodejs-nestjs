import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { RoomsService } from './rooms.service'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './messages.entity'
import { Room } from './rooms.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Message,Room])],
  controllers: [MessagesController],
  providers: [MessagesService,RoomsService]
})
export class MessagesModule {}
