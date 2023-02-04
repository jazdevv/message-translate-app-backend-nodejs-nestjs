import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//GUARD THAT USES THE JWT PASSPORT STRATEGY 
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}