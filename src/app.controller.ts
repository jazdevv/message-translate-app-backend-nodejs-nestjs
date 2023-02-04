import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './decorators/get-user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //TEST ROUTE FOR THE GUARD AND DECORATORS
  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@Req() request: Request, @User() user: any): string {
    console.log("-----------------")
    console.log(user)
    console.log(request.cookies.jwt_acces_token)
    return this.appService.getHello();
  }
}
