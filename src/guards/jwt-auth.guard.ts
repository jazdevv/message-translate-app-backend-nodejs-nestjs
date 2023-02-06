import { ExecutionContext , Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//GUARD THAT USES THE JWT PASSPORT STRATEGY 
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        // get the cookies
        const request = context.switchToHttp().getRequest();
        const cookies = request.cookies

        //hace que funcione
        return super.canActivate(context);
    }
}