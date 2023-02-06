import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class JwtAuthGuardWS implements CanActivate {
  constructor(private readonly jwtService: JwtService, private repoUsers: UsersService) {}

  async canActivate(context: ExecutionContext) {
    // get the cookies
    const cookies = context.switchToWs().getClient().handshake.headers.cookie;
    //acces the jwt cookie
    let jwtcookie = cookies.split('; ')
    .find((cookie: string) => cookie.startsWith('acces_token'))
    .split('=')[1];
    //decode jwt cookie
    const jwtdecoded = this.jwtService.verify(jwtcookie)

    const loggeduser = await this.repoUsers.findUser(jwtcookie.userid)

    if(!loggeduser){
        throw new BadRequestException('login first')
    }

    //atach data to request 
    const req = context.switchToWs().getData()
    req.logguser = loggeduser;

    //pass
    function pass():Promise<boolean>{

      return new Promise<boolean>((resolve,reject)=>{
        resolve(true)
      })
      
    }
    return pass() ;
   }
}