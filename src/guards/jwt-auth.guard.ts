import { ExecutionContext , Injectable, UnauthorizedException, CanActivate} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

//GUARD THAT USES THE JWT PASSPORT STRATEGY 
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService, private repoUsers: UsersService) {}

    async canActivate(context: ExecutionContext) {
        // get the cookies
        const request = context.switchToHttp().getRequest();
        const cookies = request.cookies
        
        if(!cookies){
            throw new UnauthorizedException('login first')
          }
          const jwtcookie = cookies.acces_token
          //decode jwt cookie
          const jwtdecoded = this.jwtService.verify(jwtcookie)
      
          const loggeduser = await this.repoUsers.findUser(jwtdecoded.userid)
      
          if(!loggeduser){
              throw new UnauthorizedException('login first')
          }

      
          //atach data to request 
          let req = context.switchToHttp().getRequest()
          req.user = loggeduser;
      
          //pass
          function pass():Promise<boolean>{
      
            return new Promise<boolean>((resolve,reject)=>{
              resolve(true)
            })
            
          }
          return pass() ;
        
    }
}