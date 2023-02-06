import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesModule } from './messages/messages.module'
import { User } from './users/user.entity'
import { Room } from './messages/rooms.entity'
import { Message } from './messages/messages.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtStrategy } from './auth/jwt.strategy';
import { UsersService } from './users/users.service';


@Module({
  
  imports: [
    UsersModule,
    MessagesModule,
    ConfigModule.forRoot({ envFilePath: `.env`,isGlobal: true }), 
    //without env variables
    TypeOrmModule.forRootAsync({imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Room,Message,User],
        synchronize: true,
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [AppController],
  providers: [AppService,JwtStrategy],
})
export class AppModule {}
