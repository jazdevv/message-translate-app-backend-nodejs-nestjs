import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { RoomsService } from './rooms.service'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './messages.entity'
import { Room } from './rooms.entity'
import { messageSocketsGateway } from './messagesockets.gateway';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/users/constants';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Message,Room]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7776000s' },
    })
  ],
  controllers: [MessagesController],
  providers: [MessagesService,RoomsService, messageSocketsGateway]
})
export class MessagesModule {}
