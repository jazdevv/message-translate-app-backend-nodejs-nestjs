import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //TEST THE GUARD
  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@Req() request: Request): string {
    console.log(request.cookies.jwt_acces_token)
    return this.appService.getHello();
  }
}
