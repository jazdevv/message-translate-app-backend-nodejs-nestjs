import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesModule } from './messages/messages.module'
import { User } from './users/user.entity'
import { Room } from './messages/rooms.entity'
import { Message } from './messages/messages.entity'
import { ConfigModule } from '@nestjs/config'


@Module({
  
  imports: [
    UsersModule,
    MessagesModule,
    ConfigModule.forRoot({ envFilePath: `.env` }), 
    //without env variables
    TypeOrmModule.forRootAsync({
      useFactory: ()=>({type: 'sqlite',
      database: 'db.sqlite',
      entities: ["join(__dirname, '**', '*.entity.{ts,js}')"],
      synchronize: true
    })
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
