import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { AppModule } from 'src/app.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7776000s' },
    }),
    S3Module
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
