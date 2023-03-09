import { Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class JwtAuthGuardWS implements CanActivate {
  constructor(private readonly jwtService: JwtService, private repoUsers: UsersService) {}

  async canActivate(context: ExecutionContext) {
    // get the cookies
    const cookies = context.switchToWs().getClient().handshake.headers.cookie;
  
    if(!cookies){
      throw new WsException('login first')
    }
    //acces the jwt cookie
    let jwtcookie = cookies.split('; ')
    .find((cookie: string) => cookie.startsWith('acces_token'))
    .split('=')[1]; 
    //decode jwt cookie
    const jwtdecoded = this.jwtService.verify(jwtcookie)

    const loggeduser = await this.repoUsers.findUser(jwtdecoded.userid)

    if(!loggeduser){
        throw new WsException('login first')
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