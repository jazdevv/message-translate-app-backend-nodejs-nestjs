import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from 'src/users/constants';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private repo: UsersService,) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    //IF USER JWT IS VALID , GET THE USER OF THAT JWT
    const user = await this.repo.findUser(payload.userid)
    console.log(user)
    return { userId: user };
  }
}